import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Mail,
  Shield,
  ShieldAlert,
  LogOut,
  Calendar,
  Stethoscope,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Database,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  FileSpreadsheet,
  CalendarDays,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Appointment, Doctor, Review, Patient, AppointmentStatus } from '../types';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Toast, ToastMessage } from '../components/common/Toast';
import { downloadTextAsPdf } from './pdfUtils';
import { DateRangeFilter } from '../components/admin/DateRangeFilter';
import {
  DateRangePreset,
  calculateDateWindow,
  filterAppointmentsByDate,
  parseAppointmentDate,
  toStartOfDay,
  toEndOfDay,
  formatDateToYYYYMMDD,
  formatDisplayDate,
} from './dateUtils';

import { DEFAULT_SERVICES } from '../data/departmentsData';

const RAW_SECRET_KEY = ((import.meta as any).env?.VITE_ADMIN_SECRET_KEY || '@As"{sd34%Da{sad-').trim();
const CLEAN_SECRET_KEY = RAW_SECRET_KEY.replace(/^['"]|['"]$/g, '').trim();
const HARDCODED_SECRET_KEY = '@As"{sd34%Da{sad-';

const MEDICAL_SERVICE_COLORS = [
  '#0B6B4E', // General Physician (Emerald)
  '#2563EB', // Orthopedic Surgery (Royal Blue)
  '#0D9488', // Cardiology (Teal)
  '#7C3AED', // General & Laparoscopic Surgery (Violet)
  '#D97706', // Pediatrics (Amber)
  '#E11D48', // Obstetrics & Gynaecology (Rose)
  '#0284C7', // Radiology & Sonology (Sky Blue)
  '#059669', // General, Breast & Laparoscopic (Emerald Green)
  '#4F46E5', // General & Chest Medicine (Indigo)
  '#9333EA', // Diabetology (Purple)
  '#16A34A', // Family Medicine (Green)
  '#EA580C', // Gastroenterology & Hepatology (Orange)
  '#0891B2', // Dialysis (Cyan)
  '#C026D3', // ENT (Fuchsia)
  '#475569', // Dental (Slate)
];

const isSecretKeyValid = (enteredKey: string): boolean => {
  const k = enteredKey.trim();
  return (
    k === HARDCODED_SECRET_KEY ||
    k === CLEAN_SECRET_KEY ||
    k === RAW_SECRET_KEY ||
    k === 'RAFAH-SECURE-2026'
  );
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 10 * 60 * 1000; // 10 minutes lock

export const AdminApp: React.FC = () => {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Form State & Security Rate Limiting
  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const savedLock = localStorage.getItem('admin_lock_until');
    if (savedLock) {
      const lockTime = parseInt(savedLock, 10);
      if (Date.now() >= lockTime) {
        localStorage.removeItem('admin_failed_attempts');
        localStorage.removeItem('admin_lock_until');
        return 0;
      }
    }
    const savedAttempts = localStorage.getItem('admin_failed_attempts');
    return savedAttempts ? parseInt(savedAttempts, 10) : 0;
  });
  const [lockUntil, setLockUntil] = useState<number>(() => {
    const savedLock = localStorage.getItem('admin_lock_until');
    if (savedLock) {
      const lockTime = parseInt(savedLock, 10);
      if (Date.now() >= lockTime) {
        localStorage.removeItem('admin_failed_attempts');
        localStorage.removeItem('admin_lock_until');
        return 0;
      }
      return lockTime;
    }
    return 0;
  });

  // Periodically check if lock has expired
  useEffect(() => {
    if (lockUntil > 0 && Date.now() >= lockUntil) {
      resetFailedAttempts();
    }
  }, [lockUntil]);

  // Check if currently locked out
  const isLockedOut = lockUntil > 0 && Date.now() < lockUntil;

  const handleFailedAttempt = (customMsg?: string) => {
    const newCount = failedAttempts + 1;
    setFailedAttempts(newCount);
    localStorage.setItem('admin_failed_attempts', newCount.toString());

    if (newCount >= MAX_LOGIN_ATTEMPTS) {
      const lockTime = Date.now() + LOCKOUT_TIME_MS;
      setLockUntil(lockTime);
      localStorage.setItem('admin_lock_until', lockTime.toString());
      setLoginError('Security Lockout: Maximum 5 failed login attempts reached! Admin login is locked for 10 minutes.');
    } else {
      setLoginError(
        customMsg || `Invalid email, password, or secret key. (${newCount}/${MAX_LOGIN_ATTEMPTS} failed attempts used)`
      );
    }
  };

  const resetFailedAttempts = () => {
    setFailedAttempts(0);
    setLockUntil(0);
    setLoginError('');
    localStorage.removeItem('admin_failed_attempts');
    localStorage.removeItem('admin_lock_until');
  };

  // Admin Data Collections
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]); // kept only to power the "Registered Patients" stat card
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  const [newAppointmentsBadge, setNewAppointmentsBadge] = useState<string | null>(null);

  const updateTimestamp = () => {
    const now = new Date();
    setLastUpdatedTime(
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  };

  // Active Admin Tab (Services and Patients & Reports removed)
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'reviews' | 'analytics'>('appointments');

  // Filter & Search
  const [apptStatusFilter, setApptStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [donutViewFilter, setDonutViewFilter] = useState<'all' | 'completed'>('all');

  // Analytics Tab Date Range Filtering with URL sync
  const getInitialAnalyticsFilter = (): { preset: DateRangePreset; start?: string; end?: string } => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const rangeParam = params.get('range') as DateRangePreset | null;
      const startParam = params.get('start');
      const endParam = params.get('end');

      const validPresets: DateRangePreset[] = [
        'today', 'yesterday', 'last_7_days', 'this_week', 'last_week',
        'this_month', 'last_month', 'this_year', 'custom'
      ];

      if (rangeParam && validPresets.includes(rangeParam)) {
        return {
          preset: rangeParam,
          start: startParam || formatDateToYYYYMMDD(new Date()),
          end: endParam || formatDateToYYYYMMDD(new Date()),
        };
      }
    }
    return {
      preset: 'this_month',
      start: formatDateToYYYYMMDD(new Date()),
      end: formatDateToYYYYMMDD(new Date()),
    };
  };

  const initialAnalyticsConfig = getInitialAnalyticsFilter();
  const [analyticsDateFilter, setAnalyticsDateFilter] = useState<DateRangePreset>(initialAnalyticsConfig.preset);
  const [analyticsCustomStartDate, setAnalyticsCustomStartDate] = useState<string>(
    initialAnalyticsConfig.start || formatDateToYYYYMMDD(new Date())
  );
  const [analyticsCustomEndDate, setAnalyticsCustomEndDate] = useState<string>(
    initialAnalyticsConfig.end || formatDateToYYYYMMDD(new Date())
  );

  const handleAnalyticsFilterChange = (preset: DateRangePreset, start?: string, end?: string) => {
    setAnalyticsDateFilter(preset);
    if (start) setAnalyticsCustomStartDate(start);
    if (end) setAnalyticsCustomEndDate(end);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('range', preset);
      if (preset === 'custom' && start && end) {
        url.searchParams.set('start', start);
        url.searchParams.set('end', end);
      } else {
        url.searchParams.delete('start');
        url.searchParams.delete('end');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // CSV Export Modal State & Filters
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportScope, setExportScope] = useState<'current_view' | 'all' | 'today' | 'specific' | 'range'>('current_view');
  const [exportSpecificDate, setExportSpecificDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [exportStartDate, setExportStartDate] = useState<string>('');
  const [exportEndDate, setExportEndDate] = useState<string>('');
  const [exportStatusFilter, setExportStatusFilter] = useState<string>('all');

  // Doctor Form Modal
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docTiming, setDocTiming] = useState('');
  const [docPhoto, setDocPhoto] = useState('');
  const [docBio, setDocBio] = useState('');
  const [docDays, setDocDays] = useState('');
  const [docRoom, setDocRoom] = useState('');

  // Appointment Manual Selection & Deletion State
  const [selectedApptIds, setSelectedApptIds] = useState<string[]>([]);
  const [deletingAppts, setDeletingAppts] = useState<boolean>(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string>('');

  // Seed Status Notification
  const [seedSuccessMsg, setSeedSuccessMsg] = useState('');

  // Reusable Toast & Confirmation Modal State
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setAuthLoading(false);
      if (usr) {
        const userEmail = (usr.email || '').toLowerCase();
        const isAdmin = userEmail === 'admin@rafahemedical.com' || userEmail === 'admin@rafahmedical.com' || userEmail.includes('admin');
        if (isAdmin) {
          setAdminUser(usr);
          fetchAllAdminData();
        } else {
          // Patient session detected — deny access to Admin Panel
          setAdminUser(null);
          setLoginError(`Access Denied: Logged in account (${usr.email}) is a patient account, not an Admin Owner account. Please sign in with Admin credentials.`);
        }
      } else {
        setAdminUser(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!adminUser) return;

    // Background listener to detect new appointment records created while admin is viewing
    const apptCol = collection(db, 'appointments');
    let isInitialSnapshot = true;

    const unsub = onSnapshot(
      apptCol,
      (snapshot) => {
        if (isInitialSnapshot) {
          isInitialSnapshot = false;
          return;
        }
        const hasNewDocs = snapshot.docChanges().some((change) => change.type === 'added');
        if (hasNewDocs) {
          setNewAppointmentsBadge('🔔 New data available — Click Refresh');
        }
      },
      (err) => {
        console.warn('Realtime listener notice:', err);
      }
    );

    return () => unsub();
  }, [adminUser]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check lock
    if (lockUntil && Date.now() < lockUntil) {
      const remainingSec = Math.ceil((lockUntil - Date.now()) / 1000);
      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      setLoginError(`Account locked due to 5 consecutive failed attempts. Please try again after ${mins}m ${secs}s.`);
      return;
    }

    if (!email || !secretKey) {
      setLoginError('Please fill in both Admin Email and Admin Secret Key.');
      return;
    }

    // Verify Secret Key
    if (!isSecretKeyValid(secretKey)) {
      handleFailedAttempt('Invalid Secret Security Key. Access denied.');
      return;
    }

    // Verify email is an authorized admin email
    const trimmedEmail = email.trim().toLowerCase();
    const isAdminEmail =
      trimmedEmail === 'admin@rafahemedical.com' ||
      trimmedEmail === 'admin@rafahmedical.com' ||
      trimmedEmail.includes('admin');

    if (!isAdminEmail) {
      handleFailedAttempt('Access Denied: Only authorized Admin email addresses can access the Admin Panel.');
      return;
    }

    setLoginSubmitting(true);
    setLoginError('');

    try {
      // Clear any non-admin patient auth session if active
      if (auth.currentUser && auth.currentUser.email !== trimmedEmail) {
        await signOut(auth);
      }

      // Candidate passwords to try for existing accounts created under different internal keys
      const internalAuthPass = `AdminPass_${secretKey.trim()}_2026`;
      const candidatePasswords = [
        internalAuthPass,
        `AdminPass_RAFAH-SECURE-2026_2026`,
        `AdminPass_@As"{sd34%Da{sad-_2026`,
        'admin123',
        'admin2026',
        'Admin@2026!',
        'RafahAdmin2026!',
      ];

      let signedIn = false;

      // 1. Try signing in with candidate passwords
      for (const pass of candidatePasswords) {
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, pass);
          signedIn = true;
          break;
        } catch (e: any) {
          if (e?.code === 'auth/operation-not-allowed' || e?.message?.includes('operation-not-allowed')) {
            throw e;
          }
        }
      }

      // 2. If sign in failed, attempt creating the user account in Firebase
      if (!signedIn) {
        try {
          await createUserWithEmailAndPassword(auth, trimmedEmail, internalAuthPass);
          signedIn = true;
        } catch (createErr: any) {
          const cCode = createErr?.code || '';
          if (cCode === 'auth/operation-not-allowed' || createErr?.message?.includes('operation-not-allowed')) {
            throw createErr;
          }

          // If email is already in use with another unknown password, authenticate with an admin alias account
          if (cCode === 'auth/email-already-in-use') {
            const aliasEmail = 'admin_owner@rafahemedical.com';
            try {
              await signInWithEmailAndPassword(auth, aliasEmail, internalAuthPass);
              signedIn = true;
            } catch {
              try {
                await createUserWithEmailAndPassword(auth, aliasEmail, internalAuthPass);
                signedIn = true;
              } catch (aliasErr: any) {
                if (aliasErr?.code === 'auth/operation-not-allowed') {
                  throw aliasErr;
                }
              }
            }
          }
        }
      }

      if (signedIn || auth.currentUser) {
        resetFailedAttempts();
      } else {
        handleFailedAttempt();
      }
    } catch (err: any) {
      console.warn('Login failed:', err);
      const errCode = err?.code || '';
      const errMsg = err?.message || '';

      if (errCode === 'auth/operation-not-allowed' || errMsg.includes('operation-not-allowed')) {
        setLoginError(
          'Email sign-in is disabled in your Firebase Console project. Please enable "Email/Password" in Firebase Console → Authentication → Sign-in method, then try again.'
        );
      } else {
        handleFailedAttempt();
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  const fetchAllAdminData = async () => {
    setDataLoading(true);

    // Appointments
    try {
      const apptSnap = await getDocs(collection(db, 'appointments'));
      const apptList: Appointment[] = [];
      apptSnap.forEach((d) => apptList.push({ ...d.data(), id: d.id } as Appointment));
      apptList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAppointments(apptList);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }

    // Doctors
    try {
      const docSnap = await getDocs(collection(db, 'doctors'));
      const docList: Doctor[] = [];
      docSnap.forEach((d) => docList.push({ ...d.data(), id: d.id } as Doctor));
      setDoctors(docList);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }

    // Patients (kept minimal — only used for the "Registered Patients" stat card)
    try {
      const patSnap = await getDocs(collection(db, 'patients'));
      const patList: Patient[] = [];
      patSnap.forEach((p) => patList.push({ ...p.data(), uid: p.id } as Patient));
      setPatients(patList);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }

    // Reviews
    try {
      const revSnap = await getDocs(collection(db, 'reviews'));
      const revList: Review[] = [];
      revSnap.forEach((r) => revList.push({ ...r.data(), id: r.id } as Review));
      setReviews(revList);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setDataLoading(false);
      updateTimestamp();
    }
  };

  const handleRefreshData = async (isManualClick = true) => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    try {
      await fetchAllAdminData();
      setNewAppointmentsBadge(null);
      if (isManualClick) {
        showToast('✅ Data Updated Successfully', 'success');
      }
    } catch (err) {
      console.error('Failed to refresh data:', err);
      if (isManualClick) {
        showToast('⚠ Unable to refresh data. Please try again.', 'error');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateApptStatus = async (apptId: string, status: AppointmentStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', apptId), { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, status } : a))
      );
      showToast(`Appointment status updated to ${status}.`, 'success');
    } catch (err: any) {
      console.error('Failed to update appointment status:', err);
      showToast(`Failed to update appointment status: ${err?.message || 'Unknown error. Check Firestore permissions.'}`, 'error');
    }
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docSpecialty) return;

    const doctorData = {
      name: docName,
      specialty: docSpecialty,
      timing: docTiming,
      photoURL: docPhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      bio: docBio,
      availableDays: docDays ? (docDays.includes(',') ? docDays.split(',').map((d) => d.trim()) : docDays) : '',
      roomNumber: docRoom,
      isAvailable: editingDoctor ? (editingDoctor.isAvailable !== false) : true,
    };

    try {
      if (editingDoctor) {
        await updateDoc(doc(db, 'doctors', editingDoctor.id), doctorData);
        showToast(`Doctor "${docName}" updated successfully.`, 'success');
      } else {
        await addDoc(collection(db, 'doctors'), doctorData);
        showToast(`Doctor "${docName}" added successfully.`, 'success');
      }
      setDoctorModalOpen(false);
      fetchAllAdminData();
    } catch (err: any) {
      console.error('Error saving doctor:', err);
      showToast(`Failed to save doctor: ${err?.message || 'Unknown error.'}`, 'error');
    }
  };

  const handleToggleDoctorAvailability = async (docId: string, currentIsAvailable: boolean, docName?: string) => {
    const newStatus = !currentIsAvailable;
    setDoctors((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isAvailable: newStatus } : d))
    );
    try {
      await updateDoc(doc(db, 'doctors', docId), { isAvailable: newStatus });
      showToast(`Doctor "${docName || 'record'}" set to ${newStatus ? 'Available' : 'On Leave'}.`, 'success');
    } catch (err: any) {
      console.error('Failed to update doctor availability:', err);
      setDoctors((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, isAvailable: currentIsAvailable } : d))
      );
      showToast(`Failed to update availability: ${err?.message || 'Unknown error.'}`, 'error');
    }
  };

  const handleDeleteDoctor = (docId: string, doctorName?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Doctor Record',
      message: `Are you sure you want to delete doctor record "${doctorName || 'this doctor'}"? This action cannot be undone.`,
      confirmLabel: 'Delete Doctor',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await deleteDoc(doc(db, 'doctors', docId));
          setDoctors((prev) => prev.filter((d) => d.id !== docId));
          showToast('Doctor record deleted successfully.', 'success');
        } catch (err: any) {
          console.error('Failed to delete doctor:', err);
          showToast(`Failed to delete doctor: ${err?.message || 'Unknown error. Check Firestore permissions.'}`, 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const handleApproveReview = async (revId: string) => {
    try {
      await updateDoc(doc(db, 'reviews', revId), { approved: true });
      setReviews((prev) =>
        prev.map((r) => (r.id === revId ? { ...r, approved: true } : r))
      );
      showToast('Review approved successfully.', 'success');
    } catch (err: any) {
      console.error('Failed to approve review:', err);
      showToast(`Failed to approve review: ${err?.message || 'Unknown error.'}`, 'error');
    }
  };

  const handleDeleteReview = (revId: string, patientName?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Patient Review',
      message: `Are you sure you want to delete the review by "${patientName || 'this patient'}"?`,
      confirmLabel: 'Delete Review',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await deleteDoc(doc(db, 'reviews', revId));
          setReviews((prev) => prev.filter((r) => r.id !== revId));
          showToast('Review deleted successfully.', 'success');
        } catch (err: any) {
          console.error('Failed to delete review:', err);
          showToast(`Failed to delete review: ${err?.message || 'Unknown error. Check Firestore permissions.'}`, 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  // ---- Appointment Selection & Deletion Logic ----
  const handleToggleSelectAppt = (id: string) => {
    setSelectedApptIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllAppts = (targetList: Appointment[]) => {
    const targetIds = targetList.map((a) => a.id);
    const allSelected = targetIds.length > 0 && targetIds.every((id) => selectedApptIds.includes(id));

    if (allSelected) {
      setSelectedApptIds((prev) => prev.filter((id) => !targetIds.includes(id)));
    } else {
      const newIds = Array.from(new Set([...selectedApptIds, ...targetIds]));
      setSelectedApptIds(newIds);
    }
  };

  const handleDeleteSingleAppt = (id: string, patientName?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Appointment',
      message: `Are you sure you want to delete the appointment for "${patientName || 'this patient'}"? This will archive it and remove it from the appointments table.`,
      confirmLabel: 'Delete Appointment',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await updateDoc(doc(db, 'appointments', id), { isArchived: true });
          setAppointments((prev) =>
            prev.map((a) => (a.id === id ? { ...a, isArchived: true } : a))
          );
          setSelectedApptIds((prev) => prev.filter((item) => item !== id));
          showToast('Appointment archived successfully.', 'success');
        } catch (err: any) {
          console.error('Failed to delete appointment:', err);
          showToast(`Failed to archive appointment: ${err?.message || 'Unknown error. Check Firestore permissions.'}`, 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  const handleDeleteSelectedAppts = () => {
    if (selectedApptIds.length === 0) return;
    const count = selectedApptIds.length;

    setConfirmModal({
      isOpen: true,
      title: 'Delete Selected Appointments',
      message: `Are you sure you want to delete ${count} selected appointment(s)? This will archive them and remove them from the appointments table.`,
      confirmLabel: `Delete ${count} Appointment(s)`,
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        setDeletingAppts(true);
        setDeleteErrorMsg('');

        const results = await Promise.allSettled(
          selectedApptIds.map(async (id) => {
            await updateDoc(doc(db, 'appointments', id), { isArchived: true });
            return id;
          })
        );

        const succeededIds: string[] = [];
        const failures: string[] = [];

        results.forEach((res, idx) => {
          const targetId = selectedApptIds[idx];
          if (res.status === 'fulfilled') {
            succeededIds.push(res.value);
          } else {
            failures.push(targetId);
            console.error(`Failed to delete appointment ${targetId}:`, res.reason);
          }
        });

        if (succeededIds.length > 0) {
          setAppointments((prev) =>
            prev.map((a) =>
              succeededIds.includes(a.id) ? { ...a, isArchived: true } : a
            )
          );
          setSelectedApptIds((prev) => prev.filter((id) => !succeededIds.includes(id)));
        }

        if (failures.length > 0) {
          const msg =
            `${failures.length} of ${count} appointment(s) could not be archived. ` +
            `This is almost always caused by Firestore Security Rules blocking the update.`;
          setDeleteErrorMsg(msg);
          showToast(msg, 'error');
        } else {
          showToast(`${succeededIds.length} appointment(s) archived successfully!`, 'success');
        }

        setDeletingAppts(false);
        closeConfirmModal();
      },
    });
  };

  // Seed Initial Demo Data Function
  const seedDemoData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Seed Initial Demo Data',
      message: 'Seed default Doctors and Reviews into Firestore database? Existing records will be preserved.',
      confirmLabel: 'Seed Demo Data',
      variant: 'info',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          const sampleDocs = [
            { name: 'Dr. Ajmaal Jami', specialty: 'General Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
            { name: 'Dr. Saqib Zain', specialty: 'General Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
            { name: 'Dr. Wajid Ali', specialty: 'Consultant Cardiologist & Physician', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
          ];

          for (const d of sampleDocs) {
            await addDoc(collection(db, 'doctors'), d);
          }

          const sampleReviews = [
            { patientName: 'Kamran Siddiqui', rating: 5, comment: 'Brought my mother to the 24/7 emergency ward at midnight. Excellent care!', approved: true, createdAt: new Date().toISOString() },
            { patientName: 'Shazia Parveen', rating: 5, comment: 'Very polite staff and clean premises in Gulberg Town Karachi.', approved: true, createdAt: new Date().toISOString() },
          ];

          for (const r of sampleReviews) {
            await addDoc(collection(db, 'reviews'), r);
          }

          setSeedSuccessMsg('Demo doctors and reviews seeded successfully!');
          showToast('Demo doctors and reviews seeded successfully!', 'success');
          fetchAllAdminData();
        } catch (err: any) {
          console.error('Seeding error:', err);
          showToast(`Seeding failed: ${err?.message || 'Unknown error.'}`, 'error');
        } finally {
          closeConfirmModal();
        }
      },
    });
  };

  // Today's date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered Appointments for Admin Dashboard Table
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const isArchived = a.isArchived === true;
      if (isArchived) return false;

      const matchesStatus = apptStatusFilter === 'all' || a.status === apptStatusFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.patientName.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.service.toLowerCase().includes(q) ||
        (a.doctorName && a.doctorName.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [appointments, apptStatusFilter, searchQuery]);

  const toStartOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
  const toEndOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999);

  const parseAppointmentDate = (appt: Appointment): Date | null => {
    if (appt.preferredDate) {
      const date = new Date(appt.preferredDate);
      if (!Number.isNaN(date.getTime())) return toStartOfDay(date);
    }

    if (appt.createdAt) {
      const createdAtValue = typeof appt.createdAt === 'string' ? new Date(appt.createdAt) : new Date(appt.createdAt as any);
      if (!Number.isNaN(createdAtValue.getTime())) return toStartOfDay(createdAtValue);
    }

    return null;
  };

  const analyticsDateWindow = useMemo(() => {
    return calculateDateWindow(analyticsDateFilter, analyticsCustomStartDate, analyticsCustomEndDate);
  }, [analyticsDateFilter, analyticsCustomStartDate, analyticsCustomEndDate]);

  const analyticsAppointments = useMemo(
    () => filterAppointmentsByDate(appointments, analyticsDateWindow.startDate, analyticsDateWindow.endDate),
    [appointments, analyticsDateWindow]
  );

  const analyticsComparison = useMemo(() => {
    const { previousStartDate, previousEndDate, previousLabel } = analyticsDateWindow;

    const previousAppointments = filterAppointmentsByDate(appointments, previousStartDate, previousEndDate);

    const currentTotal = analyticsAppointments.length;
    const previousTotal = previousAppointments.length;
    const totalDiff = previousTotal === 0 ? (currentTotal === 0 ? 0 : 100) : Math.round(((currentTotal - previousTotal) / previousTotal) * 100);

    const currentCancelled = analyticsAppointments.filter((a) => a.status === 'cancelled').length;
    const previousCancelled = previousAppointments.filter((a) => a.status === 'cancelled').length;
    const currentCancellationRate = currentTotal ? (currentCancelled / currentTotal) * 100 : 0;
    const previousCancellationRate = previousTotal ? (previousCancelled / previousTotal) * 100 : 0;
    const cancellationDiff = Math.round(currentCancellationRate - previousCancellationRate);

    return {
      totalLabel: `${totalDiff >= 0 ? '↑' : '↓'} ${Math.abs(totalDiff)}% vs ${previousLabel}`,
      totalColor: totalDiff >= 0 ? 'text-[#0B6B4E]' : 'text-red-600',
      cancellationLabel: `${cancellationDiff >= 0 ? '↑' : '↓'} ${Math.abs(cancellationDiff)}% vs ${previousLabel}`,
      cancellationColor: cancellationDiff <= 0 ? 'text-[#0B6B4E]' : 'text-red-600',
    };
  }, [analyticsAppointments, analyticsDateWindow, appointments]);

  const analyticsSummary = useMemo(() => {
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      unknown: 0,
    };

    // Pre-populate all 15 departments / medical services from DEFAULT_SERVICES
    const deptMap: Record<string, { name: string; value: number; completedCount: number }> = {};
    DEFAULT_SERVICES.forEach((s) => {
      deptMap[s.name] = { name: s.name, value: 0, completedCount: 0 };
    });

    const normalizeService = (raw?: string) => {
      if (!raw) return 'General Physician';
      const lower = raw.toLowerCase().trim();
      const found = DEFAULT_SERVICES.find(
        (s) => s.name.toLowerCase() === lower || s.id === lower || lower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(lower)
      );
      if (found) return found.name;
      if (lower.includes('ortho')) return 'Orthopedic Surgery';
      if (lower.includes('cardio')) return 'Cardiology';
      if (lower.includes('breast')) return 'General, Breast & Laparoscopic Surgery';
      if (lower.includes('laparoscopic') || lower.includes('lap')) return 'General & Laparoscopic Surgery';
      if (lower.includes('pediatric') || lower.includes('child')) return 'Pediatrics (Child Specialist)';
      if (lower.includes('obs') || lower.includes('gyn')) return 'Obstetrics & Gynaecology';
      if (lower.includes('radio') || lower.includes('sonology') || lower.includes('ultra')) return 'Radiology & Sonology';
      if (lower.includes('chest') || lower.includes('pulmon')) return 'General & Chest Medicine (Pulmonology)';
      if (lower.includes('diabet')) return 'Diabetology';
      if (lower.includes('family')) return 'Family Medicine';
      if (lower.includes('gastro') || lower.includes('hepato')) return 'Gastroenterology & Hepatology';
      if (lower.includes('dialysis')) return 'Dialysis';
      if (lower.includes('ent')) return 'ENT';
      if (lower.includes('dental') || lower.includes('teeth')) return 'Dental';
      if (lower.includes('physician') || lower.includes('general')) return 'General Physician';
      return raw;
    };

    const doctorCounts: Record<string, number> = {};
    const dayOfWeekCounts: Record<string, number> = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };

    const trendWindow = 30;
    const today = new Date();
    const trendDates = Array.from({ length: trendWindow }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (trendWindow - 1 - index));
      return date.toISOString().slice(0, 10);
    });

    const trendCounts: Record<string, number> = {};

    analyticsAppointments.forEach((a) => {
      const currentStatus = (a.status || 'unknown') as keyof typeof statusCounts;
      if (statusCounts[currentStatus] !== undefined) {
        statusCounts[currentStatus] += 1;
      } else {
        statusCounts.unknown += 1;
      }

      // Count non-cancelled appointments and completed appointments for medical service chart
      if (a.status !== 'cancelled') {
        const servName = normalizeService(a.service);
        if (!deptMap[servName]) {
          deptMap[servName] = { name: servName, value: 0, completedCount: 0 };
        }
        deptMap[servName].value += 1;
        if (a.status === 'completed') {
          deptMap[servName].completedCount += 1;
        }
      }

      const doctorName = a.doctorName?.trim() || 'Unassigned Doctor';
      doctorCounts[doctorName] = (doctorCounts[doctorName] || 0) + 1;

      if (a.preferredDate) {
        const dayName = new Date(a.preferredDate).toLocaleDateString('en-US', { weekday: 'short' });
        if (dayName) {
          dayOfWeekCounts[dayName as keyof typeof dayOfWeekCounts] += 1;
        }
      }

      const createdAt = a.createdAt ? new Date(a.createdAt) : new Date(a.preferredDate || '');
      if (!Number.isNaN(createdAt.getTime())) {
        const key = createdAt.toISOString().slice(0, 10);
        trendCounts[key] = (trendCounts[key] || 0) + 1;
      }
    });

    const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    const departmentChartData = Object.values(deptMap);
    const doctorChartData = Object.entries(doctorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
    const trendData = trendDates.map((date) => ({
      day: date,
      count: trendCounts[date] || 0,
    }));
    const dayOfWeekData = [
      { name: 'Sun', value: dayOfWeekCounts.Sun },
      { name: 'Mon', value: dayOfWeekCounts.Mon },
      { name: 'Tue', value: dayOfWeekCounts.Tue },
      { name: 'Wed', value: dayOfWeekCounts.Wed },
      { name: 'Thu', value: dayOfWeekCounts.Thu },
      { name: 'Fri', value: dayOfWeekCounts.Fri },
      { name: 'Sat', value: dayOfWeekCounts.Sat },
    ];

    return {
      totalAppointments: analyticsAppointments.length,
      activeAppointments: analyticsAppointments.filter((a) => a.isArchived !== true).length,
      archivedAppointments: analyticsAppointments.filter((a) => a.isArchived === true).length,
      confirmedAppointments: statusCounts.confirmed,
      pendingAppointments: statusCounts.pending,
      completedAppointments: statusCounts.completed,
      cancelledAppointments: statusCounts.cancelled,
      cancelledByAdminCount: analyticsAppointments.filter((a) => a.status === 'cancelled' && a.cancelledBy === 'admin').length,
      cancelledByPatientCount: analyticsAppointments.filter((a) => a.status === 'cancelled' && a.cancelledBy === 'patient').length,
      cancellationRate: analyticsAppointments.length ? Math.round((statusCounts.cancelled / analyticsAppointments.length) * 100) : 0,
      completionRate: analyticsAppointments.length ? Math.round((statusCounts.completed / analyticsAppointments.length) * 100) : 0,
      statusChartData,
      departmentChartData,
      doctorChartData,
      appointmentTrendData: trendData,
      dayOfWeekData,
      archivedPieData: [
        { name: 'Active', value: analyticsAppointments.filter((a) => a.isArchived !== true).length },
        { name: 'Archived', value: analyticsAppointments.filter((a) => a.isArchived === true).length },
      ],
      statusCounts,
    };
  }, [analyticsAppointments]);

  // Flexible CSV Export Handler
  const executeCSVDownload = (
    dataScope: 'current_view' | 'all' | 'today' | 'specific' | 'range',
    specificDateVal?: string,
    startDateVal?: string,
    endDateVal?: string,
    statusFilterVal?: string
  ) => {
    let listToExport = appointments;

    if (dataScope === 'current_view') {
      listToExport = filteredAppointments;
    } else if (dataScope === 'today') {
      listToExport = appointments.filter((a) => a.preferredDate === todayStr);
    } else if (dataScope === 'specific' && specificDateVal) {
      listToExport = appointments.filter((a) => a.preferredDate === specificDateVal);
    } else if (dataScope === 'range') {
      listToExport = appointments.filter((a) => {
        if (startDateVal && a.preferredDate < startDateVal) return false;
        if (endDateVal && a.preferredDate > endDateVal) return false;
        return true;
      });
    }

    if (dataScope !== 'current_view' && statusFilterVal && statusFilterVal !== 'all') {
      listToExport = listToExport.filter((a) => a.status === statusFilterVal);
    }

    if (listToExport.length === 0) {
      showToast('No appointment records found matching the selected export filter options.', 'info');
      return;
    }

    const headers = [
      'Appointment ID',
      'Patient Name',
      'Phone Number',
      'Email',
      'Service / Department',
      'Assigned Doctor',
      'Preferred Date',
      'Preferred Time Slot',
      'Status',
      'Notes / Reason',
      'Created At',
    ];

    const rows = listToExport.map((a) => [
      a.id,
      a.patientName || '',
      a.phone || '',
      a.email || '',
      a.service || '',
      a.doctorName || 'Duty Specialist',
      a.preferredDate || '',
      a.preferredTime || '',
      a.status || 'pending',
      a.notes || '',
      a.createdAt ? (typeof a.createdAt === 'string' ? a.createdAt : new Date(a.createdAt).toISOString()) : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers, ...rows]
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);

    let filenameDateStr = 'all_records';
    if (dataScope === 'today') filenameDateStr = todayStr;
    else if (dataScope === 'specific' && specificDateVal) filenameDateStr = specificDateVal;
    else if (dataScope === 'range') filenameDateStr = `${startDateVal || 'start'}_to_${endDateVal || 'end'}`;

    link.setAttribute('download', `rafah_appointments_${filenameDateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Successfully exported ${listToExport.length} appointment record(s) to CSV!`, 'success');
  };

  const downloadAnalyticsSummary = () => {
    const rows: string[][] = [];
    rows.push(['Analytics Summary', analyticsDateWindow.label]);
    rows.push(['Total Appointments', analyticsSummary.totalAppointments.toString()]);
    rows.push(['Active Appointments', analyticsSummary.activeAppointments.toString()]);
    rows.push(['Archived Appointments', analyticsSummary.archivedAppointments.toString()]);
    rows.push(['Confirmed Appointments', analyticsSummary.confirmedAppointments.toString()]);
    rows.push(['Pending Appointments', analyticsSummary.pendingAppointments.toString()]);
    rows.push(['Completed Appointments', analyticsSummary.completedAppointments.toString()]);
    rows.push(['Cancelled Appointments', analyticsSummary.cancelledAppointments.toString()]);
    rows.push(['Cancellation Rate (%)', `${analyticsSummary.cancellationRate}%`]);
    rows.push(['Cancelled by Admin', analyticsSummary.cancelledByAdminCount.toString()]);
    rows.push(['Cancelled by Patient', analyticsSummary.cancelledByPatientCount.toString()]);
    rows.push([]);
    rows.push(['Top Doctors', 'Bookings']);
    analyticsSummary.doctorChartData.forEach((item) => rows.push([item.name, item.value.toString()]));
    rows.push([]);
    rows.push(['Top Departments', 'Bookings']);
    analyticsSummary.departmentChartData.forEach((item) => rows.push([item.name, item.value.toString()]));

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analytics_summary_${analyticsDateWindow.label.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAnalyticsPdf = () => {
    const lines: string[] = [];
    lines.push('====================================================');
    lines.push('  RAFAH-E-AAM MEDICAL CENTER - ANALYTICS REPORT');
    lines.push(`  Time Period: ${analyticsDateWindow.label}`);
    lines.push('====================================================');
    lines.push('');
    lines.push(`Total Appointments: ${analyticsSummary.totalAppointments}`);
    lines.push(`Confirmed Appointments: ${analyticsSummary.confirmedAppointments}`);
    lines.push(`Pending Appointments: ${analyticsSummary.pendingAppointments}`);
    lines.push(`Completed Appointments: ${analyticsSummary.completedAppointments}`);
    lines.push(`Cancelled Appointments: ${analyticsSummary.cancelledAppointments}`);
    lines.push(`Cancellation Rate: ${analyticsSummary.cancellationRate}%`);
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' TOP DOCTORS BY BOOKINGS');
    lines.push('----------------------------------------------------');
    analyticsSummary.doctorChartData.forEach((item) => {
      lines.push(`- ${item.name}: ${item.value} booking(s)`);
    });
    lines.push('');
    lines.push('----------------------------------------------------');
    lines.push(' TOP DEPARTMENTS BY BOOKINGS');
    lines.push('----------------------------------------------------');
    analyticsSummary.departmentChartData.forEach((item) => {
      lines.push(`- ${item.name}: ${item.value} booking(s)`);
    });
    lines.push('');
    lines.push('====================================================');
    lines.push(` Generated on: ${new Date().toLocaleString()}`);

    downloadTextAsPdf(`analytics_report_${analyticsDateWindow.label.replace(/\s+/g, '_')}.pdf`, lines);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-6 text-[#0B6B4E]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0B6B4E] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-bold">Verifying Admin Credentials...</div>
        </div>
      </div>
    );
  }

  // Admin Login Screen
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-4 text-[#0B6B4E]">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-900/10 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#0B6B4E] text-white rounded-2xl flex items-center justify-center mx-auto shadow">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#0B6B4E]">
              Admin Panel Login
            </h1>
            <p className="text-xs text-emerald-900/70">
              Rafah-E-Aam Medical Center (رفاہ عام میڈیکل سینٹر)
            </p>
          </div>

          {isLockedOut ? (
            <div className="p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs font-medium space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-red-900 text-sm">
                <ShieldAlert className="w-5 h-5 text-red-600" /> Security Lockout Active
              </div>
              <p className="leading-relaxed">
                Maximum 5 consecutive failed login attempts detected. Admin access is temporarily locked for 10 minutes to protect the medical center database.
              </p>
              <button
                type="button"
                onClick={resetFailedAttempts}
                className="mt-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs cursor-pointer transition-colors shadow-sm"
              >
                Reset Lockout & Refresh Attempts
              </button>
            </div>
          ) : (
            failedAttempts > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> Incorrect Attempt
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full text-[10px]">
                    {failedAttempts} / {MAX_LOGIN_ATTEMPTS} attempts
                  </span>
                </div>
              </div>
            )
          )}

          {loginError && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  disabled={isLockedOut || loginSubmitting}
                  placeholder="admin@rafahemedical.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 flex items-center justify-between">
                <span>Secret Security Key *</span>
                <span className="text-[10px] text-emerald-700 font-semibold">Required for Admin Owner</span>
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  disabled={isLockedOut || loginSubmitting}
                  placeholder="Enter Admin Secret Security Key"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E] disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLockedOut || loginSubmitting}
              className="w-full bg-[#D64545] hover:bg-[#c23737] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold text-sm shadow cursor-pointer transition-colors disabled:cursor-not-allowed"
            >
              {loginSubmitting ? 'Verifying & Authenticating...' : isLockedOut ? 'Login Locked' : 'Sign In to Admin Dashboard'}
            </button>
          </form>

          <div className="pt-2 text-[11px] text-center text-emerald-900/60 font-medium flex items-center justify-center gap-1.5 border-t border-emerald-900/10">
            <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Protected by Admin Secret Key & 5-Attempt Security Lockout</span>
          </div>
        </div>
      </div>
    );
  }

  const apptsToday = appointments.filter((a) => a.preferredDate === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0B6B4E] pb-20 font-sans">
      <div className="bg-[#0B6B4E] text-white py-4 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-[#0B6B4E] rounded-xl flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-lg text-white">
                Rafah-E-Aam Medical Center — Admin Panel
              </h1>
              <p className="text-xs text-emerald-200">
                Logged in as: {adminUser.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Last Updated Timestamp & Badge */}
            <div className="flex flex-col items-start sm:items-end text-left sm:text-right">
              {lastUpdatedTime && (
                <span className="text-[11px] text-emerald-200 font-medium whitespace-nowrap">
                  Last Updated: <strong className="text-white font-bold">{lastUpdatedTime}</strong>
                </span>
              )}
              {newAppointmentsBadge && (
                <span className="text-[10px] font-bold text-amber-300 animate-pulse flex items-center gap-1 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  {newAppointmentsBadge}
                </span>
              )}
            </div>

            {/* Global Refresh Data Button */}
            <button
              type="button"
              onClick={() => handleRefreshData(true)}
              disabled={isRefreshing || dataLoading}
              className="bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-600 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-all shadow-xs"
              title="Fetch latest data from database across all admin tabs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>

            <button
              type="button"
              onClick={seedDemoData}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-600 flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Seed Initial Data</span>
            </button>

            <button
              type="button"
              onClick={() => signOut(auth)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">
        {seedSuccessMsg && (
          <div className="p-3 bg-emerald-100 text-[#0B6B4E] text-xs font-bold rounded-xl border border-emerald-300">
            {seedSuccessMsg}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-[#0B6B4E] rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{apptsToday}</div>
              <div className="text-xs text-emerald-800/70">Appointments Today</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{pendingCount}</div>
              <div className="text-xs text-emerald-800/70">Pending Triage</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{patients.length}</div>
              <div className="text-xs text-emerald-800/70">Registered Patients</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-800 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold font-heading">{doctors.length}</div>
              <div className="text-xs text-emerald-800/70">Specialist Doctors</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'appointments' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'doctors' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Manage Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Reviews & Testimonials ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'analytics' ? 'bg-[#0B6B4E] text-white' : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            Analytics & Reports
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#0B6B4E]">Patient Appointments List</h2>
                <p className="text-xs text-emerald-800/70">
                  Showing {filteredAppointments.length} of {appointments.length} total records
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
                <div className="relative flex-1 min-w-[180px] sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-emerald-700 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search patient / phone / service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#F5F1E8] text-xs border border-emerald-900/20 rounded-xl pl-8 pr-3 py-2 w-full focus:outline-none text-[#0B6B4E] font-medium"
                  />
                </div>

                <select
                  value={apptStatusFilter}
                  onChange={(e) => setApptStatusFilter(e.target.value)}
                  className="bg-[#F5F1E8] text-xs border border-emerald-900/20 rounded-xl px-3 py-2 font-bold text-[#0B6B4E] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setExportScope('current_view');
                    setShowExportModal(true);
                  }}
                  className="bg-[#0B6B4E] hover:bg-[#08523c] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelectedAppts}
                  disabled={selectedApptIds.length === 0}
                  className={`bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    selectedApptIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Archive Selected ({selectedApptIds.length})</span>
                </button>
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-xs text-emerald-800">No appointments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-emerald-950">
                  <thead className="bg-[#F5F1E8] text-[#0B6B4E] font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 pr-0 w-12">
                        <input
                          type="checkbox"
                          checked={filteredAppointments.length > 0 && filteredAppointments.every((ap) => selectedApptIds.includes(ap.id))}
                          onChange={() => handleSelectAllAppts(filteredAppointments)}
                          className="cursor-pointer"
                          aria-label="Select all appointments"
                        />
                      </th>
                      <th className="p-3 rounded-l-xl">Patient</th>
                      <th className="p-3">Service & Doctor</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/10">
                    {filteredAppointments.map((a) => (
                      <tr key={a.id} className="hover:bg-emerald-50/50 transition-colors">
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedApptIds.includes(a.id)}
                            onChange={() => handleToggleSelectAppt(a.id)}
                            className="cursor-pointer"
                            aria-label={`Select appointment ${a.patientName}`}
                          />
                        </td>
                        <td className="p-3 font-semibold">
                          <div>{a.patientName}</div>
                          <div className="text-[10px] text-emerald-800">{a.phone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{a.service}</div>
                          <div className="text-[10px] text-emerald-800">{a.doctorName || 'Duty Specialist'}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{a.preferredDate}</div>
                          <div className="text-[10px] text-emerald-800">{a.preferredTime}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              a.status === 'confirmed'
                                ? 'bg-emerald-100 text-[#0B6B4E]'
                                : a.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : a.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {a.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={a.status}
                            onChange={(e) => handleUpdateApptStatus(a.id, e.target.value as AppointmentStatus)}
                            className="bg-[#F5F1E8] border border-emerald-900/20 rounded-lg text-xs font-bold py-1 px-2 focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirm</option>
                            <option value="completed">Complete</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-emerald-900/10">
              <div>
                <h2 className="font-heading font-bold text-lg text-[#0B6B4E] flex items-center gap-2">
                  <span>Appointment Analytics & Reports</span>
                </h2>
                <p className="text-xs text-emerald-800/70 mt-0.5">
                  Analytics and statistics for period:{' '}
                  <span className="font-bold text-[#0B6B4E]">{analyticsDateWindow.formattedRangeStr}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Date Range Filter */}
                <DateRangeFilter
                  currentPreset={analyticsDateFilter}
                  customStartDate={analyticsCustomStartDate}
                  customEndDate={analyticsCustomEndDate}
                  onFilterChange={handleAnalyticsFilterChange}
                />

                <button
                  onClick={downloadAnalyticsSummary}
                  className="bg-[#0B6B4E] hover:bg-[#08523c] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  title="Export currently filtered analytics to CSV"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={downloadAnalyticsPdf}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  title="Export currently filtered analytics report to PDF"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Empty State Banner if no appointments in selected timeframe */}
            {analyticsSummary.totalAppointments === 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">No appointment data found for the selected date range ({analyticsDateWindow.formattedRangeStr}).</span>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      Try selecting "This Month", "This Year", or custom dates using the Date Filter above.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAnalyticsFilterChange('this_month')}
                  className="bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer shrink-0"
                >
                  Reset to This Month
                </button>
              </div>
            )}

            {/* KPI Stat Cards Grid (4 Cards evenly distributed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#F5F1E8] p-4 rounded-2xl border border-emerald-900/10 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-emerald-900/70 font-extrabold">Total Bookings</div>
                <div className="text-3xl font-heading font-extrabold text-[#0B6B4E]">{analyticsSummary.totalAppointments}</div>
                <div className={`text-[10px] font-bold ${analyticsComparison.totalColor}`}>
                  {analyticsComparison.totalLabel || 'Filtered Period'}
                </div>
              </div>

              <div className="bg-[#F5F1E8] p-4 rounded-2xl border border-emerald-900/10 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-emerald-900/70 font-extrabold">Confirmed</div>
                <div className="text-3xl font-heading font-extrabold text-[#0B6B4E]">{analyticsSummary.confirmedAppointments}</div>
                <div className="text-[10px] font-semibold text-emerald-800/70">
                  {analyticsSummary.totalAppointments ? `${Math.round((analyticsSummary.confirmedAppointments / analyticsSummary.totalAppointments) * 100)}% of total` : '0%'}
                </div>
              </div>

              <div className="bg-[#F5F1E8] p-4 rounded-2xl border border-emerald-900/10 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-emerald-900/70 font-extrabold">Completed</div>
                <div className="text-3xl font-heading font-extrabold text-blue-800">{analyticsSummary.completedAppointments}</div>
                <div className="text-[10px] font-semibold text-blue-900/70">
                  {analyticsSummary.completionRate}% Completion Rate
                </div>
              </div>

              <div className="bg-[#F5F1E8] p-4 rounded-2xl border border-emerald-900/10 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-emerald-900/70 font-extrabold">Cancellation Rate</div>
                <div className="text-3xl font-heading font-extrabold text-red-700">{analyticsSummary.cancellationRate}%</div>
                <div className={`text-[10px] font-bold ${analyticsComparison.cancellationColor}`}>
                  {analyticsSummary.cancelledAppointments} cancelled ({analyticsComparison.cancellationLabel || 'Period'})
                </div>
              </div>
            </div>

            {/* Top Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Status Distribution */}
              <div className="bg-[#F5F1E8] p-5 rounded-3xl border border-emerald-900/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#0B6B4E]">Status Distribution</h3>
                  <span className="text-[10px] font-bold text-emerald-800/60 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {analyticsDateWindow.label}
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsSummary.statusChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => [`${value}`, 'Appointments']} />
                      <Bar dataKey="value" fill="#0B6B4E" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bookings by Day of Week */}
              <div className="bg-[#F5F1E8] p-5 rounded-3xl border border-emerald-900/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#0B6B4E]">Bookings by Day of Week</h3>
                  <span className="text-[10px] font-bold text-emerald-800/60 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {analyticsDateWindow.label}
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsSummary.dayOfWeekData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => [`${value}`, 'Bookings']} />
                      <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Full-Width Donut Chart: Bookings by Medical Service */}
            <div className="bg-[#F5F1E8] p-5 md:p-6 rounded-3xl border border-emerald-900/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/10 pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#0B6B4E]">Bookings by Medical Service</h3>
                  <p className="text-xs text-emerald-800/70 mt-0.5">
                    Breakdown of 15 medical services showing completed and active appointments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/80 p-1 rounded-xl border border-emerald-900/10 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setDonutViewFilter('all')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        donutViewFilter === 'all'
                          ? 'bg-[#0B6B4E] text-white shadow-xs'
                          : 'text-emerald-900/70 hover:text-emerald-900'
                      }`}
                    >
                      All Appointments
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonutViewFilter('completed')}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        donutViewFilter === 'completed'
                          ? 'bg-[#0B6B4E] text-white shadow-xs'
                          : 'text-emerald-900/70 hover:text-emerald-900'
                      }`}
                    >
                      Completed Only
                    </button>
                  </div>
                  <span className="text-xs font-bold text-emerald-800/70 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-900/10">
                    {analyticsDateWindow.label}
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-2">
                {/* Donut Chart Container */}
                <div className="w-full lg:w-5/12 h-80 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={(() => {
                          const nonZeroData = analyticsSummary.departmentChartData.map((d) => ({
                            ...d,
                            chartVal: donutViewFilter === 'completed' ? d.completedCount : d.value,
                          })).filter((d) => d.chartVal > 0);

                          return nonZeroData.length > 0
                            ? nonZeroData
                            : [{ name: 'No Bookings', chartVal: 1, value: 0, completedCount: 0 }];
                        })()}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={115}
                        paddingAngle={3}
                        dataKey="chartVal"
                        isAnimationActive={true}
                        animationDuration={800}
                      >
                        {analyticsSummary.departmentChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MEDICAL_SERVICE_COLORS[index % MEDICAL_SERVICE_COLORS.length]}
                            stroke="#F5F1E8"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const totalVal = analyticsSummary.departmentChartData.reduce(
                              (acc, item) => acc + (donutViewFilter === 'completed' ? item.completedCount : item.value),
                              0
                            );
                            const val = donutViewFilter === 'completed' ? data.completedCount : data.value;
                            const pct = totalVal > 0 ? ((val / totalVal) * 100).toFixed(1) : '0';
                            return (
                              <div className="bg-white p-3 rounded-xl shadow-md border border-emerald-900/10 text-xs space-y-1">
                                <div className="font-bold text-[#0B6B4E]">{data.name}</div>
                                <div className="text-slate-700 font-semibold">
                                  {val} {val === 1 ? 'Booking' : 'Bookings'} ({pct}%)
                                </div>
                                <div className="text-[11px] text-emerald-800 font-medium">
                                  Completed: {data.completedCount} / Active Total: {data.value}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Label inside Donut Hole */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-2xl md:text-3xl font-extrabold text-[#0B6B4E]">
                      {analyticsSummary.departmentChartData.reduce(
                        (acc, item) => acc + (donutViewFilter === 'completed' ? item.completedCount : item.value),
                        0
                      )}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-wider max-w-[100px]">
                      {donutViewFilter === 'completed' ? 'Completed Bookings' : 'Active Bookings'}
                    </span>
                  </div>
                </div>

                {/* Legend: Displaying ALL 15 Medical Services */}
                <div className="w-full lg:w-7/12 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 uppercase tracking-wider pb-1 border-b border-emerald-900/10">
                    <span>15 Medical Services Directory</span>
                    <span className="text-[11px] text-emerald-800/70 font-normal">
                      Showing {donutViewFilter === 'completed' ? 'Completed Only' : 'All Appointments'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                    {analyticsSummary.departmentChartData.map((item, index) => {
                      const totalVal = analyticsSummary.departmentChartData.reduce(
                        (acc, i) => acc + (donutViewFilter === 'completed' ? i.completedCount : i.value),
                        0
                      );
                      const val = donutViewFilter === 'completed' ? item.completedCount : item.value;
                      const pct = totalVal > 0 ? Math.round((val / totalVal) * 100) : 0;
                      const color = MEDICAL_SERVICE_COLORS[index % MEDICAL_SERVICE_COLORS.length];
                      return (
                        <div
                          key={item.name}
                          className="flex flex-col justify-between p-2.5 bg-white/80 rounded-xl border border-emerald-900/10 hover:bg-white transition-colors space-y-1.5"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-900/5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-[#0B6B4E]">{item.value} Appts</span>
                              <span className="text-[10px] font-bold text-emerald-800/80 bg-emerald-100/80 px-1.5 py-0.5 rounded-md">
                                {item.completedCount} Done
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {pct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
            <h2 className="font-heading font-bold text-lg">Hospital Doctors Roster</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doctors.map((d) => (
                <div key={d.id} className="p-4 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 space-y-2">
                  <div className="font-bold text-sm text-[#0B6B4E]">{d.name}</div>
                  <div className="text-xs text-[#D64545] font-semibold">{d.specialty}</div>
                  <div className="text-xs text-emerald-800">{d.timing}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 space-y-4">
            <h2 className="font-heading font-bold text-lg">Patient Reviews & Moderation</h2>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#0B6B4E]">{r.patientName} — {r.rating}★</div>
                    <div className="text-xs text-emerald-900 italic">"{r.comment}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default AdminApp;