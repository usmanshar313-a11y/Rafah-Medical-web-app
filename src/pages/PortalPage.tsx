import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Calendar,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Heart,
  Plus,
  Bell,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Appointment, AppointmentStatus } from '../types';
import { Toast, ToastMessage } from '../components/common/Toast';

export const PortalPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, patientProfile, loading, signUpWithEmail, signInWithEmail, updatePatientProfile, logout } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Auth Toggle & Form States
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginNoAccount, setLoginNoAccount] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupConfirmEmailChecked, setSignupConfirmEmailChecked] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupAlreadyExists, setSignupAlreadyExists] = useState(false);
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetSentModalOpen, setResetSentModalOpen] = useState(false);
  const [resetSentEmail, setResetSentEmail] = useState('');

  // Profile Edit Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileBloodGroup, setProfileBloodGroup] = useState('A+');
  const [profileEmergencyContact, setProfileEmergencyContact] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Toast & Confirm Modal state
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (patientProfile) {
      setProfileName(patientProfile.name || '');
      setProfilePhone(patientProfile.phone || '');
      setProfileDob(patientProfile.dob || '');
      setProfileBloodGroup(patientProfile.bloodGroup || 'A+');
      setProfileEmergencyContact(patientProfile.emergencyContact || '');
    }
  }, [patientProfile]);

  useEffect(() => {
    if (user) {
      fetchPatientData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setResetSentModalOpen(false);
    }
  }, [user]);

  const fetchPatientData = async () => {
    const currentUid = auth.currentUser?.uid || user?.uid;
    if (!currentUid) return;
    setLoadingData(true);
    try {
      // Fetch Appointments strictly by patientId (auth.currentUser.uid)
      const apptQ = query(collection(db, 'appointments'), where('patientId', '==', currentUid));
      const apptSnap = await getDocs(apptQ);
      const fetchedAppts: Appointment[] = [];

      apptSnap.forEach((d) => {
        fetchedAppts.push({ id: d.id, ...d.data() } as Appointment);
      });

      fetchedAppts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAppointments(fetchedAppts);
    } catch (err) {
      console.error('Error fetching patient data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginSubmitting) return;
    setLoginError('');
    setLoginNoAccount(false);

    const cleanEmail = loginEmail.trim();
    if (!cleanEmail) {
      setLoginError('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your Secret Portal Key.');
      return;
    }

    setLoginSubmitting(true);
    try {
        await signInWithEmail(cleanEmail, loginPassword);
        setResetSentModalOpen(false);
        setResetMessage('');
    } catch (err: any) {
        console.error('LOGIN ERROR CODE:', err?.code, 'MESSAGE:', err?.message, 'RAW:', err);
        try {
          await signOut(auth);
        } catch (e) {
          // ignore signOut errors
        }
      const code = err?.code || '';
      const msg = err?.message || '';

      if (code === 'auth/user-not-found') {
        setLoginNoAccount(true);
        setLoginError('No account found with this email. Please sign up first.');
      } else if (code === 'auth/wrong-password') {
        setLoginError('Incorrect password. Please try again.');
      } else if (code === 'auth/invalid-credential' || msg.includes('auth/invalid-credential')) {
        try {
          const lowerEmail = cleanEmail.toLowerCase();
          const [snap1, snap2, snapAppt1, snapAppt2] = await Promise.all([
            getDocs(query(collection(db, 'patients'), where('email', '==', cleanEmail))),
            getDocs(query(collection(db, 'patients'), where('email', '==', lowerEmail))),
            getDocs(query(collection(db, 'appointments'), where('email', '==', cleanEmail))),
            getDocs(query(collection(db, 'appointments'), where('email', '==', lowerEmail)))
          ]);

          if (!snap1.empty || !snap2.empty || !snapAppt1.empty || !snapAppt2.empty) {
            setLoginError('Incorrect password. Please try again.');
          } else {
            setLoginNoAccount(true);
            setLoginError('No account found with this email. Please sign up first.');
          }
        } catch {
          setLoginError('Incorrect password or credentials.');
        }
      } else if (code === 'auth/invalid-email') {
        setLoginError('Please enter a valid email address.');
      } else {
        setLoginError(err?.message || 'Failed to log in. Please check your credentials.');
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handlePasswordResetSubmit = async () => {
    if (resetSubmitting) return;
    setResetMessage('');
    setLoginError('');

    const cleanEmail = resetEmail.trim();
    if (!cleanEmail) {
      setLoginError('Please enter your email address to reset your password.');
      return;
    }

    setResetSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      const message = 'If an account exists with this email, a password reset link was sent. Please check your inbox and spam folders.';
      setResetMessage(message);
      setResetSentEmail(cleanEmail);
      setResetSentModalOpen(true);
      setShowResetPassword(false);
      setResetEmail('');
    } catch (err: any) {
      console.error('Password reset error:', err);
      const message = 'If an account exists with this email, a password reset link was sent. Please check your inbox and spam folders.';
      setResetMessage(message);
      setResetSentEmail(cleanEmail);
      setResetSentModalOpen(true);
      setShowResetPassword(false);
      setResetEmail('');
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupSubmitting) return;
    setSignupError('');
    setSignupAlreadyExists(false);

    const cleanEmail = signupEmail.trim();
    if (!signupName.trim()) {
      setSignupError('Please enter your full name.');
      return;
    }
    if (!cleanEmail) {
      setSignupError('Please enter your email address.');
      return;
    }
    if (!signupPassword) {
      setSignupError('Please enter your Secret Portal Key.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (!signupConfirmEmailChecked) {
      setSignupError('Please confirm that your email address is correct.');
      return;
    }

    setSignupSubmitting(true);
    try {
        // Ensure there is no lingering auth session before creating a new user
        try {
          await signOut(auth);
        } catch (e) {
          // ignore signOut errors
        }

        await signUpWithEmail(cleanEmail, signupPassword, signupName);
    } catch (err: any) {
        console.error('SIGNUP ERROR CODE:', err?.code, 'MESSAGE:', err?.message, 'RAW:', err);
        const code = err?.code || '';
        const msg = err?.message || '';
        if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
          setSignupAlreadyExists(true);
          setSignupError('This email is already registered. Please log in instead.');
        } else if (code === 'auth/weak-password') {
          setSignupError('Password is too weak.');
        } else if (code === 'auth/invalid-email') {
          setSignupError('Please enter a valid email address.');
        } else {
          setSignupError(err?.message || 'Failed to create account. Please try again.');
        }
    } finally {
      setSignupSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAppointments([]);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setLoginNoAccount(false);
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setSignupConfirmEmailChecked(false);
    setSignupError('');
    setSignupAlreadyExists(false);
    setAuthMode('login');
  };

  const handleCancelAppointment = (apptId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment?',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          const ref = doc(db, 'appointments', apptId);
          await updateDoc(ref, { status: 'cancelled' });
          setAppointments((prev) =>
            prev.map((a) => (a.id === apptId ? { ...a, status: 'cancelled' } : a))
          );
          setToast({ message: 'Your appointment has been cancelled successfully.', type: 'success' });
        } catch (err) {
          console.error('Failed to cancel appointment:', err);
          setToast({
            message: 'Failed to cancel appointment. Please check your network connection or try again.',
            type: 'error',
          });
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleDeleteAppointment = (apptId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Appointment',
      message: 'Are you sure you want to delete this appointment?',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isLoading: true }));
        try {
          await deleteDoc(doc(db, 'appointments', apptId));
          setAppointments((prev) => prev.filter((a) => a.id !== apptId));
          setToast({ message: 'Appointment deleted successfully.', type: 'success' });
        } catch (err) {
          console.error('Failed to delete appointment:', err);
          setToast({ message: 'Failed to delete appointment. Please try again.', type: 'error' });
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        }
      },
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccessMsg('');
    try {
      await updatePatientProfile({
        name: profileName,
        phone: profilePhone,
        dob: profileDob,
        bloodGroup: profileBloodGroup,
        emergencyContact: profileEmergencyContact,
      });
      setProfileSuccessMsg('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  // Helper countdown text calculation
  const getCountdownText = (dateStr: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `In ${diffDays} days`;
    return 'Past date';
  };

  const normalizeAppointmentStatus = (status: AppointmentStatus) => String(status || '').trim().toLowerCase();

  const getStatusBadge = (status: AppointmentStatus) => {
    const normalizedStatus = normalizeAppointmentStatus(status);
    switch (normalizedStatus) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-[#0B6B4E] px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'completed':
      case 'done':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5" /> Pending Confirmation
          </span>
        );
    }
  };

  const isAppointmentCancelled = (status: AppointmentStatus) => {
    const normalizedStatus = normalizeAppointmentStatus(status);
    return normalizedStatus === 'cancelled' || normalizedStatus === 'canceled';
  };

  // Password strength checks for Sign Up: length, number, uppercase, symbol
  const hasLength = signupPassword.length >= 8;
  const hasNumber = /\d/.test(signupPassword);
  const hasUpper = /[A-Z]/.test(signupPassword);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(signupPassword);
  const isPasswordStrong = hasLength && hasNumber && hasUpper && hasSymbol;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#0B6B4E] border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-sm font-bold text-[#0B6B4E]">Loading Patient Portal...</div>
        </div>
      </div>
    );
  }

  // Render Login / Sign Up UI if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] py-12 px-4 flex items-center justify-center text-[#0B6B4E]">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-900/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#0B6B4E] text-white rounded-full flex items-center justify-center mx-auto shadow">
              {authMode === 'login' ? <LogIn className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-[#0B6B4E]">
              {authMode === 'login' ? 'Patient Portal Login' : 'Create Patient Account'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-900/80">
              {authMode === 'login'
                ? 'Sign in with your registered email & Secret Portal Key to view appointments.'
                : 'Register your details to schedule medical appointments and access your records.'}
            </p>
          </div>

          {/* Form switch tab pills */}
          <div className="bg-emerald-900/5 p-1 rounded-xl flex gap-1">
            <button
              type="button"
              onClick={() => {
                if (signupEmail && !loginEmail) setLoginEmail(signupEmail.trim());
                setAuthMode('login');
                setLoginError('');
                setLoginNoAccount(false);
                setSignupError('');
                setSignupAlreadyExists(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                authMode === 'login' ? 'bg-[#0B6B4E] text-white shadow-xs' : 'text-emerald-900 hover:bg-emerald-900/10'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                if (loginEmail && !signupEmail) setSignupEmail(loginEmail.trim());
                setAuthMode('signup');
                setLoginError('');
                setLoginNoAccount(false);
                setSignupError('');
                setSignupAlreadyExists(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                authMode === 'signup' ? 'bg-[#0B6B4E] text-white shadow-xs' : 'text-emerald-900 hover:bg-emerald-900/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-300 p-3.5 rounded-xl text-xs text-red-800 font-medium space-y-2.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{loginError}</span>
                  </div>
                  {loginNoAccount && (
                    <button
                      type="button"
                      onClick={() => {
                        setSignupEmail(loginEmail.trim());
                        setSignupName('');
                        setSignupPassword('');
                        setSignupConfirmPassword('');
                        setSignupConfirmEmailChecked(false);
                        setSignupError('');
                        setSignupAlreadyExists(false);
                        setLoginError('');
                        setLoginNoAccount(false);
                        setAuthMode('signup');
                      }}
                      className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs mt-1"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Go to Sign Up (Email Pre-filled)</span>
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-800/50 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="patient@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F5F1E8]/40 border border-emerald-900/20 rounded-xl text-xs font-medium text-[#0B6B4E] focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Secret Portal Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-800/50 absolute left-3 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your Secret Portal Key"
                    required
                    className="w-full pl-9 pr-11 py-2.5 bg-[#F5F1E8]/40 border border-emerald-900/20 rounded-xl text-xs font-medium text-[#0B6B4E] focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-emerald-700 hover:text-emerald-900"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loginSubmitting ? 'Verifying Key...' : 'Log In to Patient Portal'}</span>
              </button>

              <div className="flex flex-col items-center gap-3 text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-xs text-[#0B6B4E] font-bold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (loginEmail && !signupEmail) setSignupEmail(loginEmail.trim());
                    setLoginError('');
                    setLoginNoAccount(false);
                    setSignupError('');
                    setSignupAlreadyExists(false);
                    setAuthMode('signup');
                  }}
                  className="text-xs text-[#0B6B4E] font-bold hover:underline cursor-pointer"
                >
                  Don't have an account? Sign Up
                </button>
              </div>

              {showResetPassword && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-[#0B6B4E]">
                  <h4 className="text-sm font-bold">Reset Password</h4>
                  <p className="text-xs text-emerald-900/80 mt-1 mb-3">
                    Enter the email address used for your patient account.
                  </p>
                  {resetMessage ? (
                    <div className="p-3 bg-emerald-100 text-emerald-900 text-xs rounded-xl mb-3">
                      {resetMessage}
                    </div>
                  ) : null}
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-700 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-emerald-900/20 rounded-xl text-xs font-medium text-[#0B6B4E] focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="flex-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl py-2 text-xs font-bold hover:bg-emerald-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handlePasswordResetSubmit}
                      disabled={resetSubmitting}
                      className="flex-1 bg-[#0B6B4E] text-white rounded-xl py-2 text-xs font-bold hover:bg-[#08523c] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {resetSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* SIGNUP FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {signupError && (
                <div className="bg-red-50 border border-red-300 p-3.5 rounded-xl text-xs text-red-800 font-medium space-y-2.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{signupError}</span>
                  </div>
                  {signupAlreadyExists && (
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail(signupEmail.trim());
                        setLoginPassword('');
                        setLoginError('');
                        setLoginNoAccount(false);
                        setSignupError('');
                        setSignupAlreadyExists(false);
                        setAuthMode('login');
                      }}
                      className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs mt-1"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Go to Login (Email Pre-filled)</span>
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-800/50 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Fatima Ali"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F5F1E8]/40 border border-emerald-900/20 rounded-xl text-xs font-medium text-[#0B6B4E] focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-800/50 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="fatima@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F5F1E8]/40 border border-emerald-900/20 rounded-xl text-xs font-medium text-[#0B6B4E] focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Secret Portal Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-800/50 absolute left-3 top-3" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create your Secret Portal Key"
                    required
                    className="w-full pl-9 pr-11 py-2.5 bg-[#F5F1E8]/40 border border-emerald-900/20 rounded-xl text-xs font-medium text-[#0B6B4E] focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-emerald-700 hover:text-emerald-900"
                  >
                    {showSignupPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {/* Password strength checklist */}
                <div className="mt-2 text-xs text-emerald-900/90">
                  <div className="flex flex-col gap-1 pl-1">
                    <div className="flex items-center gap-2">
                      {hasLength ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <XCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className={hasLength ? 'text-emerald-900 font-semibold' : 'text-emerald-700'}>At least 8 characters</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasNumber ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <XCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className={hasNumber ? 'text-emerald-900 font-semibold' : 'text-emerald-700'}>Includes a number</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasUpper ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <XCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className={hasUpper ? 'text-emerald-900 font-semibold' : 'text-emerald-700'}>Includes an uppercase letter</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasSymbol ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <XCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className={hasSymbol ? 'text-emerald-900 font-semibold' : 'text-emerald-700'}>Includes a symbol (e.g. !@#$%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-800/50 absolute left-3 top-3" />
                  <input
                    type={showSignupConfirmPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter your Secret Portal Key"
                    required
                    className="w-full pl-9 pr-11 py-2.5 bg-[#F5F1E8]/40 border border-emerald-900/20 rounded-xl text-xs font-medium text-[#0B6B4E] focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-emerald-700 hover:text-emerald-900"
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-emerald-900/90 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={signupConfirmEmailChecked}
                    onChange={(e) => setSignupConfirmEmailChecked(e.target.checked)}
                    required
                    className="mt-0.5 rounded text-[#0B6B4E] focus:ring-[#0B6B4E]"
                  />
                  <span className="font-semibold leading-snug">
                    I confirm my email address is correct
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={signupSubmitting || !isPasswordStrong}
                className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm mt-2"
                title={!isPasswordStrong ? 'Password must be 8+ chars and include number, uppercase and symbol' : undefined}
              >
                <UserPlus className="w-4 h-4" />
                <span>{signupSubmitting ? 'Creating Account...' : 'Create Account & Sign In'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (signupEmail && !loginEmail) setLoginEmail(signupEmail.trim());
                    setLoginError('');
                    setLoginNoAccount(false);
                    setSignupError('');
                    setSignupAlreadyExists(false);
                    setAuthMode('login');
                  }}
                  className="text-xs text-[#0B6B4E] font-bold hover:underline cursor-pointer"
                >
                  Already have an account? Log In
                </button>
              </div>
            </form>
          )}
        </div>

        {resetSentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-3xl bg-emerald-100 p-3 text-emerald-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B6B4E]">Reset Link Sent</h3>
                    <p className="mt-2 text-sm text-emerald-900/80">
                      If an account exists for <span className="font-semibold">{resetSentEmail || 'this email'}</span>, a password reset link was sent.
                      Please check your inbox and spam folders.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-[#F7FBEF] border border-emerald-200 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">Important:</p>
                  <p className="mt-2">
                    The reset email may appear in Gmail <span className="font-semibold">Spam</span> or <span className="font-semibold">Promotions</span>, and the sender may show as <span className="font-semibold">"noreply"</span>.
                  </p>
                  <p className="mt-2">
                    If you don't see it shortly, please search for <span className="font-semibold">noreply</span> or check your spam folder.
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setResetSentModalOpen(false)}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#0B6B4E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#08523c] transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Check for confirmed notification banner
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0B6B4E] pb-20">
      
      {/* Portal Header */}
      <div className="bg-[#0B6B4E] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-800 text-white font-bold text-xl flex items-center justify-center border-2 border-white shadow">
              {(patientProfile?.name || auth.currentUser?.displayName || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Welcome, {patientProfile?.name || auth.currentUser?.displayName || 'Patient'}
              </h1>
              <p className="text-xs text-emerald-100 flex flex-wrap items-center gap-2 mt-0.5">
                <span>Patient ID: {(auth.currentUser?.uid || user.uid).slice(0, 8)}</span>
                <span>•</span>
                <span>Email: {auth.currentUser?.email || user.email}</span>
                <span>•</span>
                <span>Phone: {patientProfile?.phone || 'Not set'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-emerald-600 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Confirmed Banner Notification */}
        {confirmedCount > 0 && (
          <div className="bg-emerald-900 text-white p-4 rounded-2xl shadow-sm border border-emerald-700 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Appointment Confirmed!</span> You have{' '}
                <span className="font-bold text-amber-200">{confirmedCount}</span> confirmed appointment(s) at Rafah-E-Aam Medical Center.
              </div>
            </div>
            <button
              onClick={() => setActiveTab('appointments')}
              className="bg-white text-[#0B6B4E] font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow-xs cursor-pointer"
            >
              View Details
            </button>
          </div>
        )}

        {/* Portal Tabs Bar */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#0B6B4E] text-white shadow-xs'
                : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#0B6B4E] text-white shadow-xs'
                : 'text-emerald-900 hover:bg-[#F5F1E8]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>

        {/* Tab 1: My Appointments */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-heading font-bold text-xl text-[#0B6B4E]">
                Scheduled Appointments
              </h2>
              <button
                onClick={() => {
                  navigate('/doctors');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#D64545] hover:bg-[#c23737] text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book New Appointment</span>
              </button>
            </div>

            {loadingData ? (
              <div className="bg-white p-8 rounded-2xl text-center text-sm font-medium">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-emerald-900/10 text-center space-y-4">
                <Calendar className="w-12 h-12 text-emerald-700/40 mx-auto" />
                <h3 className="font-bold text-base text-[#0B6B4E]">No appointments found</h3>
                <p className="text-xs text-emerald-900/70 max-w-sm mx-auto">
                  You haven't requested any medical appointments yet. Click below to browse departments, select your specialist, and schedule a visit.
                </p>
                <button
                  onClick={() => {
                    navigate('/doctors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#D64545] hover:bg-[#c23737] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-colors cursor-pointer"
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((appt) => {
                  const countdown = getCountdownText(appt.preferredDate);
                  return (
                    <div
                      key={appt.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-col justify-between space-y-4 relative"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          {getStatusBadge(appt.status)}

                          {countdown && appt.status !== 'cancelled' && (
                            <span className="text-[11px] font-bold text-[#D64545] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                              {countdown}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-heading font-bold text-base text-[#0B6B4E]">
                            {appt.service}
                          </h3>
                          <div className="text-xs text-emerald-900 font-medium">
                            Doctor: {appt.doctorName || 'Duty Specialist'}
                          </div>
                        </div>

                        <div className="p-3 bg-[#F5F1E8] rounded-xl space-y-1 text-xs">
                          <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#0B6B4E]" />
                            <span>Date: {appt.preferredDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-[#0B6B4E]" />
                            <span>Time Slot: {appt.preferredTime}</span>
                          </div>
                          {appt.reason && (
                            <div className="text-emerald-800/80 pt-1 text-[11px]">
                              Reason: {appt.reason}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-3 border-t border-emerald-900/10">
                        <button
                          onClick={() => handleDeleteAppointment(appt.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs py-1 px-3 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                        >
                          Delete Appointment
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-emerald-900/10 space-y-6 max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-xl text-[#0B6B4E]">
              Edit Patient Profile
            </h2>

            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-100 text-[#0B6B4E] text-xs font-bold rounded-xl">
                {profileSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profileDob}
                    onChange={(e) => setProfileDob(e.target.value)}
                    className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Blood Group</label>
                  <select
                    value={profileBloodGroup}
                    onChange={(e) => setProfileBloodGroup(e.target.value)}
                    className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={profileEmergencyContact}
                    onChange={(e) => setProfileEmergencyContact(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="w-full bg-[#D64545] hover:bg-[#c23737] text-white py-3 rounded-xl font-bold text-sm shadow cursor-pointer disabled:opacity-50"
              >
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

      </div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-900/10 overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0B6B4E]">{confirmModal.title}</h3>
                  <p className="mt-2 text-sm text-emerald-900/80">{confirmModal.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="text-emerald-900 hover:text-emerald-700 font-semibold"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 border-t border-emerald-900/10 p-4 sm:p-5">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-full sm:w-auto flex-1 rounded-xl border border-emerald-900/20 bg-emerald-50 text-emerald-900 py-3 text-sm font-semibold hover:bg-emerald-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                disabled={confirmModal.isLoading}
                className="w-full sm:w-auto flex-1 rounded-xl bg-red-600 text-white py-3 text-sm font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {confirmModal.isLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
};

