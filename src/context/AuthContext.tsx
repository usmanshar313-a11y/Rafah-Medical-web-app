import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { Patient } from '../types';

interface AuthContextType {
  user: User | null;
  patientProfile: Patient | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string, name: string, phone: string) => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  updatePatientProfile: (updatedData: Partial<Patient>) => Promise<void>;
  refreshPatientProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrCreatePatient = async (firebaseUser: User, extraData?: Partial<Patient>) => {
    try {
      const patientRef = doc(db, 'patients', firebaseUser.uid);
      const snap = await getDoc(patientRef);

      if (snap.exists()) {
        setPatientProfile(snap.data() as Patient);
      } else {
        const newPatient: Patient = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || extraData?.name || 'Patient',
          email: firebaseUser.email || extraData?.email || '',
          phone: firebaseUser.phoneNumber || extraData?.phone || '',
          photoURL: firebaseUser.photoURL || '',
          createdAt: new Date().toISOString(),
          ...extraData,
        };
        await setDoc(patientRef, newPatient);
        setPatientProfile(newPatient);
      }
    } catch (err) {
      console.error('Error in fetchOrCreatePatient:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchOrCreatePatient(currentUser);
      } else {
        setPatientProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await fetchOrCreatePatient(res.user);
      }
      return res.user;
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, phone: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await fetchOrCreatePatient(res.user, { name, phone, email });
      }
      return res.user;
    } catch (error) {
      console.error('Email Signup Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await fetchOrCreatePatient(res.user);
      }
      return res.user;
    } catch (error) {
      console.error('Email Signin Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setPatientProfile(null);
  };

  const updatePatientProfile = async (updatedData: Partial<Patient>) => {
    if (!user) return;
    const patientRef = doc(db, 'patients', user.uid);
    await updateDoc(patientRef, updatedData);
    setPatientProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const refreshPatientProfile = async () => {
    if (user) {
      await fetchOrCreatePatient(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        patientProfile,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        updatePatientProfile,
        refreshPatientProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
