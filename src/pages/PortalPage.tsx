import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Appointment, AppointmentStatus } from '../types';
import { BookingModal } from '../components/booking/BookingModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Toast, ToastMessage } from '../components/common/Toast';

export const PortalPage: React.FC = () => {
  const { user, patientProfile, loading, signInWithGoogle, updatePatientProfile, logout } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'appointments' | 'profile'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Profile Edit Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileDob, setProfileDob] = useState('');
  const [profileBloodGroup, setProfileBloodGroup] = useState('A+');
  const [profileEmergencyContact, setProfileEmergencyContact] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Embedded booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

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

  const fetchPatientData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      // Fetch Appointments by patientId & email
      const apptQ = query(collection(db, 'appointments'), where('patientId', '==', user.uid));
      const apptSnap = await getDocs(apptQ);
      const fetchedAppts: Appointment[] = [];
      const seenApptIds = new Set<string>();

      apptSnap.forEach((d) => {
        seenApptIds.add(d.id);
        fetchedAppts.push({ id: d.id, ...d.data() } as Appointment);
      });

      if (user.email) {
        const apptQ2 = query(collection(db, 'appointments'), where('email', '==', user.email));
        const apptSnap2 = await getDocs(apptQ2);
        apptSnap2.forEach((d) => {
          if (!seenApptIds.has(d.id)) {
            seenApptIds.add(d.id);
            fetchedAppts.push({ id: d.id, ...d.data() } as Appointment);
          }
        });
      }

      fetchedAppts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setAppointments(fetchedAppts);
    } catch (err) {
      console.error('Error fetching patient data:', err);
    } finally {
      setLoadingData(false);
    }
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

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-[#0B6B4E] px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'cancelled':
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] py-16 px-4 flex items-center justify-center text-[#0B6B4E]">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-emerald-900/10 text-center space-y-6">
          <div className="w-16 h-16 bg-[#0B6B4E] text-white rounded-full flex items-center justify-center mx-auto shadow">
            <User className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-heading font-extrabold text-2xl text-[#0B6B4E]">
              Patient Portal Access
            </h2>
            <p className="text-xs sm:text-sm text-emerald-900/80 mt-2">
              Sign in to manage your appointments, book doctor visits, and update your patient profile.
            </p>
          </div>

          <button
            onClick={() => signInWithGoogle()}
            className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white font-bold py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>
        </div>
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
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={patientProfile?.name || 'Patient'}
                className="w-14 h-14 rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-emerald-800 text-white font-bold text-xl flex items-center justify-center border-2 border-white">
                {patientProfile?.name?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                Welcome, {patientProfile?.name || user.displayName}
              </h1>
              <p className="text-xs text-emerald-100 flex items-center gap-2 mt-0.5">
                <span>Patient ID: {user.uid.slice(0, 8)}</span>
                <span>•</span>
                <span>Phone: {patientProfile?.phone || 'Not set'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-emerald-600"
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
              className="bg-white text-[#0B6B4E] font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 shadow-xs"
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
            <h2 className="font-heading font-bold text-xl text-[#0B6B4E]">
              Scheduled Appointments
            </h2>

            {loadingData ? (
              <div className="bg-white p-8 rounded-2xl text-center text-sm font-medium">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-emerald-900/10 text-center space-y-4">
                <Calendar className="w-12 h-12 text-emerald-700/40 mx-auto" />
                <h3 className="font-bold text-base text-[#0B6B4E]">No appointments found</h3>
                <p className="text-xs text-emerald-900/70 max-w-sm mx-auto">
                  You haven't requested any medical appointments yet. Click below to book a visit with our specialist doctors.
                </p>
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="bg-[#D64545] text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow"
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

                      <div className="flex items-center justify-end pt-3 border-t border-emerald-900/10 gap-2">
                        {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="text-red-600 hover:text-red-800 font-bold text-xs py-1 px-3 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                          >
                            Cancel Appointment
                          </button>
                        )}
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

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          fetchPatientData();
        }}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        isLoading={confirmModal.isLoading}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
};
