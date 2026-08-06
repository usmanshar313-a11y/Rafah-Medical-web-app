export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Patient {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  dob?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  patientPhone?: string;
  email: string;
  address?: string;
  gender?: string;
  service: string;
  doctorId?: string;
  doctorName?: string;
  preferredDate: string;
  preferredTime?: string;
  reason?: string;
  status: AppointmentStatus;
  notes?: string;
  cancellationMessage?: string;
  smsSent?: boolean;
  smsSentAt?: string;
  smsError?: string;
  source: string;
  createdAt: string;
  hiddenForPatient?: boolean;
  patientArchived?: boolean;
  isArchived?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  timing?: string;
  photoURL?: string;
  bio?: string;
  availableDays?: string[] | string;
  phone?: string;
  roomNumber?: string;
  fee?: string;
  departmentId?: string;
  isAvailable?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  timing?: string;
  days?: string;
  fee?: string;
  icon?: string;
  doctors: Doctor[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string;
  department?: string;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  patientName?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  uploadedBy: 'admin' | 'patient';
  uploadedAt: string;
  description?: string;
}
