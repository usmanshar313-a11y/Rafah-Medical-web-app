import { Department, Doctor, Service } from '../types';

export const DEPARTMENTS_DATA: Department[] = [
  {
    id: 'gen-physician',
    name: 'General OPD & Internal Medicine',
    description: 'Comprehensive adult outpatient consultations, hypertension management, fever & infectious care, diabetes screening, and general medical checkups.',
    timing: '09:00 AM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-1',
        name: 'Dr. Ajmaal Jami',
        specialty: 'General Physician',
        availableDays: 'Mon - Sat',
        timing: '09:00 AM - 01:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'OPD-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior General Physician with over 15+ years experience in chronic disease management and adult outpatient care.'
      },
      {
        id: 'doc-2',
        name: 'Dr. Saqib Zain',
        specialty: 'General Physician',
        availableDays: 'Mon - Sat',
        timing: '05:00 PM - 09:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'OPD-2',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in primary medical care, hypertension control, seasonal fevers, and preventive health screenings.'
      },
      {
        id: 'doc-32',
        name: 'Dr. Bushra Rabbani',
        specialty: 'Consultant General Physician',
        availableDays: 'Mon, Wed, Fri',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'OPD-3',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant physician specializing in internal medicine, elder care, and metabolic health.'
      }
    ]
  },
  {
    id: 'cardiology',
    name: 'Cardiology & Heart Care',
    description: 'Expert cardiac consultations, ECG diagnostics, blood pressure monitoring, heart disease prevention, and post-cardiac surgery recovery care.',
    timing: '02:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,500',
    icon: 'heart',
    doctors: [
      {
        id: 'doc-3',
        name: 'Dr. Wajid Ali',
        specialty: 'Consultant Cardiologist & Physician',
        availableDays: 'Mon, Wed, Fri',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Cardio-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Cardiologist specializing in ischemic heart disease, hypertension management, and non-invasive cardiac diagnostics.'
      },
      {
        id: 'doc-16',
        name: 'Dr. Syed Saadat Ali',
        specialty: 'Cardiologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Cardio-2',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Experienced clinical cardiologist offering consultations for angina, arrhythmia, and cardiac health evaluations.'
      },
      {
        id: 'doc-17',
        name: 'Dr. Usman Alam',
        specialty: 'Cardiologist',
        availableDays: 'Mon - Sat',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Cardio-3',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in preventative cardiology, hypertension, and routine heart health checks.'
      }
    ]
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Care',
    description: 'Advanced bone and joint care, fracture alignment, spinal disorder management, arthritis consultations, and orthopedic trauma stabilization.',
    timing: '06:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,500',
    icon: 'activity',
    doctors: [
      {
        id: 'doc-25',
        name: 'Dr. Akhtar Baig',
        specialty: 'Orthopedic Specialist',
        availableDays: 'Mon - Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Ortho-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Renowned Orthopedic consultant with deep expertise in bone fractures, joint arthritis, back pain, and spinal alignment.'
      }
    ]
  },
  {
    id: 'gen-lap-surgery',
    name: 'General, Laparoscopic & Surgical Care',
    description: 'Minimally invasive keyhole laparoscopic procedures, hernia repair, gallbladder surgery, appendectomy, breast surgery, and general surgical consultation.',
    timing: '04:00 PM - 09:00 PM',
    days: 'Daily',
    fee: 'Rs. 1,500',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-4',
        name: 'Dr. S. Kashif Mateen',
        specialty: 'Consultant General & Laparoscopic Surgeon',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'OT-1',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior laparoscopic surgeon providing expert keyhole surgical procedures, hernia repair, and abdominal surgery.'
      },
      {
        id: 'doc-22',
        name: 'Dr. Erum Kazim',
        specialty: 'General, Breast & Laparoscopic Surgeon',
        availableDays: 'Mon - Sat',
        timing: '04:00 PM - 07:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'OT-2',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Assistant Professor Surgery at DUHS & Civil Hospital Karachi. Specialist in breast surgery, endocrine procedures, and laparoscopic surgery.'
      },
      {
        id: 'doc-23',
        name: 'Dr. Mubashir Iqbal',
        specialty: 'General, Breast & Laparoscopic Surgeon',
        availableDays: 'Mon, Wed, Fri',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'OT-3',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant surgeon specializing in general surgery, wound management, and laparoscopic procedures.'
      },
      {
        id: 'doc-24',
        name: 'Dr. Masood',
        specialty: 'General & Laparoscopic Surgeon',
        availableDays: 'Daily',
        timing: '07:00 PM - 10:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'OT-4',
        photoURL: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
        bio: 'Experienced surgeon providing emergency and elective surgical consultations.'
      }
    ]
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Child Health',
    description: 'Dedicated healthcare for infants, toddlers, and children, growth and developmental monitoring, childhood vaccination programs, and pediatric emergency care.',
    timing: '10:00 AM - 11:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'baby',
    doctors: [
      {
        id: 'doc-5',
        name: 'Dr. Hira',
        specialty: 'Child Specialist',
        availableDays: 'Mon - Sat',
        timing: '10:00 AM - 02:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Peds-1',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Compassionate pediatric specialist caring for newborn health, infant growth, and childhood fevers.'
      },
      {
        id: 'doc-6',
        name: 'Dr. S.M. Hussain Hadi Naqvi',
        specialty: 'Child Specialist',
        availableDays: 'Mon, Wed, Fri',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Peds-2',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior pediatrician specializing in childhood respiratory illnesses, nutrition, and vaccination.'
      },
      {
        id: 'doc-7',
        name: 'Dr. Saud Abdul Qayyum',
        specialty: 'Child Specialist',
        availableDays: 'Tue, Thu, Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Peds-3',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant child specialist with expertise in pediatric infectious diseases and asthma.'
      },
      {
        id: 'doc-8',
        name: 'Dr. Amir Hussain',
        specialty: 'Child Specialist',
        availableDays: 'Mon - Sat',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Peds-4',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Pediatric care consultant focusing on toddler wellness, immunity, and developmental milestones.'
      },
      {
        id: 'doc-9',
        name: 'Dr. Syed Habib Ahmed',
        specialty: 'Child Specialist',
        availableDays: 'Mon - Sat',
        timing: '08:00 PM - 11:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Peds-5',
        photoURL: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
        bio: 'Night-duty pediatric consultant providing emergency child health consultations.'
      }
    ]
  },
  {
    id: 'obs-gyn',
    name: 'Obstetrics & Gynaecology (Maternity Care)',
    description: 'Comprehensive maternity care, antenatal screening, high-risk pregnancy management, gynecological consultations, postnatal care, and women reproductive health.',
    timing: '11:00 AM - 10:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'heart',
    doctors: [
      {
        id: 'doc-10',
        name: 'Dr. Ghazala Naseem',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '11:00 AM - 02:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gynae-1',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior Gynaecologist with extensive experience in antenatal monitoring, safe delivery, and reproductive health.'
      },
      {
        id: 'doc-11',
        name: 'Dr. Fauzia Ali',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '04:00 PM - 07:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gynae-2',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Obstetrician providing personalized maternal care, ultrasound consultations, and gynecological care.'
      },
      {
        id: 'doc-12',
        name: 'Dr. Misbah Noreen',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Mon - Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Gynae-3',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Experienced specialist in pregnancy health, PCOS treatment, and routine gynecological consultations.'
      },
      {
        id: 'doc-13',
        name: 'Dr. Ferheen',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '02:00 PM - 05:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Gynae-4',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant in maternal-fetal wellness and family planning consultations.'
      },
      {
        id: 'doc-14',
        name: 'Dr. Sanawar Pasha',
        specialty: 'Obstetrics & Gynaecologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '07:00 PM - 10:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gynae-5',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in high-risk pregnancy support and laparoscopic gynecological procedures.'
      }
    ]
  },
  {
    id: 'radiology-sonology',
    name: 'Radiology & Diagnostic Sonology',
    description: 'High-precision abdominal, pelvic, and obstetrical ultrasound scans, Doppler imaging, diagnostic radiology, and organ sonography.',
    timing: '10:00 AM - 11:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'flask',
    doctors: [
      {
        id: 'doc-18',
        name: 'Dr. Javeriya Qureshi',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Mon - Sat',
        timing: '10:00 AM - 02:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-1',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Expert Sonologist offering abdominal ultrasound, pelvic scans, anomaly scans, and Doppler studies.'
      },
      {
        id: 'doc-19',
        name: 'Dr. Shabana Saeed',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '03:00 PM - 06:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-2',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Diagnostic Radiology specialist with focus on fetal sonography and soft tissue imaging.'
      },
      {
        id: 'doc-20',
        name: 'Dr. Gulnaz Ismail',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-3',
        photoURL: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?auto=format&fit=crop&w=400&q=80',
        bio: 'Sonologist providing fast-turnaround ultrasound reporting and Doppler diagnostics.'
      },
      {
        id: 'doc-21',
        name: 'Dr. S.M. Shahnawaz',
        specialty: 'Sonologist & Radiologist',
        availableDays: 'Mon - Sat',
        timing: '08:00 PM - 11:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Radio-4',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Radiologist specializing in emergency ultrasound scanning and radiological interpretation.'
      }
    ]
  },
  {
    id: 'diabetology',
    name: 'Diabetology & Endocrinology',
    description: 'Comprehensive diabetes management, HbA1c control, insulin adjustment, diabetic neuropathy care, and dietary counseling.',
    timing: '05:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-28',
        name: 'Dr. Shakeel Ahmed',
        specialty: 'Diabetologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Diabetes-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Diabetologist offering specialized blood sugar regulation, diabetic foot care, and lifestyle coaching.'
      },
      {
        id: 'doc-29',
        name: 'Dr. Qazi Mujahid Ali',
        specialty: 'Diabetologist',
        availableDays: 'Tue, Thu, Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Diabetes-2',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Diabetologist focused on Type 1 & Type 2 diabetes control and preventing organ complications.'
      }
    ]
  },
  {
    id: 'chest-pulmonology',
    name: 'General & Chest Medicine (Pulmonology)',
    description: 'Specialized respiratory care, asthma treatment, chronic bronchitis, chest infections, tuberculosis management, and lung health evaluations.',
    timing: '04:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,500',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-26',
        name: 'Dr. Nadia Adnan',
        specialty: 'General & Chest Physician',
        availableDays: 'Mon, Wed, Fri',
        timing: '04:00 PM - 07:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Chest-1',
        photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
        bio: 'Chest Physician providing specialized management for asthma, severe cough, respiratory allergies, and lung care.'
      },
      {
        id: 'doc-27',
        name: 'Dr. Syed Ali Talha Raza',
        specialty: 'General & Chest Physician',
        availableDays: 'Tue, Thu, Sat',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Chest-2',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Pulmonology consultant experienced in chronic bronchitis, pneumonia, and post-viral respiratory recovery.'
      }
    ]
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology & Hepatology',
    description: 'Specialist consultations for stomach acidity, liver diseases, hepatitis B/C care, peptic ulcers, IBS, and digestive health.',
    timing: '06:00 PM - 09:00 PM',
    days: 'Mon, Wed, Fri',
    fee: 'Rs. 1,500',
    icon: 'flask',
    doctors: [
      {
        id: 'doc-31',
        name: 'Dr. Suresh Kumar',
        specialty: 'Gastroenterologist / Hepatologist',
        availableDays: 'Mon, Wed, Fri',
        timing: '06:00 PM - 09:00 PM',
        fee: 'Rs. 1,500',
        roomNumber: 'Gastro-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Gastroenterologist specializing in digestive disorders, liver health, stomach acidity, and gut health.'
      }
    ]
  },
  {
    id: 'family-medicine',
    name: 'Family Medicine & Primary Care',
    description: 'Holistic primary care for all family members, preventive wellness checkups, routine health monitoring, and long-term illness management.',
    timing: '09:00 AM - 02:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-30',
        name: 'Dr. M. Naseem Akhter',
        specialty: 'Family Physician',
        availableDays: 'Mon - Sat',
        timing: '09:00 AM - 02:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Family-1',
        photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
        bio: 'Family medicine consultant dedicated to multi-generational family healthcare and wellness.'
      }
    ]
  },
  {
    id: 'dialysis',
    name: 'Dialysis & Nephrology Unit',
    description: 'Hemodialysis support, renal failure consultations, kidney function monitoring, and specialized nephrology support.',
    timing: '09:00 AM - 05:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,200',
    icon: 'flask',
    doctors: [
      {
        id: 'doc-33',
        name: 'Dr. Moeen Qureshi',
        specialty: 'General & Dialysis Specialist',
        availableDays: 'Mon - Sat',
        timing: '09:00 AM - 05:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'Dialysis Unit',
        photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist overseeing hemodialysis procedures, fluid balance, and renal failure management.'
      }
    ]
  },
  {
    id: 'ent',
    name: 'ENT (Ear, Nose & Throat)',
    description: 'Comprehensive ENT consultations, sinus allergy treatment, tonsillitis care, hearing evaluations, and nasal disorder treatment.',
    timing: '05:00 PM - 08:00 PM',
    days: 'Tue, Thu, Sat',
    fee: 'Rs. 1,200',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-34',
        name: 'Dr. Asif Ali Abbasi',
        specialty: 'ENT Specialist',
        availableDays: 'Tue, Thu, Sat',
        timing: '05:00 PM - 08:00 PM',
        fee: 'Rs. 1,200',
        roomNumber: 'ENT-1',
        photoURL: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant ENT surgeon providing medical and surgical solutions for ear, nose, throat, and sinus conditions.'
      }
    ]
  },
  {
    id: 'dental',
    name: 'Dental Surgery & Oral Care',
    description: 'Complete oral hygiene care, dental surgery, tooth extractions, root canal consultations, scaling, and preventive dental care.',
    timing: '05:00 PM - 09:00 PM',
    days: 'Mon - Sat',
    fee: 'Rs. 1,000',
    icon: 'stethoscope',
    doctors: [
      {
        id: 'doc-15',
        name: 'Dr. Khurram Zia',
        specialty: 'Consultant Dental Surgeon',
        availableDays: 'Mon - Sat',
        timing: '05:00 PM - 09:00 PM',
        fee: 'Rs. 1,000',
        roomNumber: 'Dental-1',
        photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        bio: 'Consultant Dental Surgeon offering painless dental procedures, restorative dentistry, and oral surgery.'
      }
    ]
  },
  {
    id: 'emergency-247',
    name: '24/7 Emergency & Casualty Care',
    description: 'Immediate trauma stabilization, acute casualty care, round-the-clock emergency medical oxygen, nebulization, ECG, and urgent triage.',
    timing: '24 Hours / 7 Days',
    days: 'All Days (24/7)',
    fee: 'Rs. 800',
    icon: 'shield-alert',
    doctors: [
      {
        id: 'doc-er',
        name: '24/7 ER Casualty Medical Officer',
        specialty: 'Emergency Medicine & Acute Care',
        availableDays: 'Daily 24 Hours',
        timing: '24/7 Immediate',
        fee: 'Rs. 800',
        roomNumber: 'ER Triage',
        photoURL: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
        bio: 'On-duty emergency medical team ready 24/7 for immediate casualty response, nebulization, and acute medical triage.'
      }
    ]
  }
];

export const ALL_DOCTORS: Doctor[] = DEPARTMENTS_DATA.flatMap((dept) =>
  dept.doctors.map((doc) => ({
    ...doc,
    departmentId: dept.id,
  }))
);

export const DEFAULT_SERVICES: Service[] = [
  { id: 'gen-physician', name: 'General Physician', description: 'Comprehensive adult outpatient consultations & health checkups' },
  { id: 'orthopedics', name: 'Orthopedic Surgery', description: 'Bone, joint, fracture & spinal care consultations' },
  { id: 'cardiology', name: 'Cardiology', description: 'Consultant cardiac care & heart health diagnostics' },
  { id: 'gen-lap-surgery', name: 'General & Laparoscopic Surgery', description: 'Minimally invasive laparoscopic & surgical procedures' },
  { id: 'pediatrics', name: 'Pediatrics (Child Specialist)', description: 'Childhood healthcare, growth monitoring & vaccinations' },
  { id: 'obs-gyn', name: 'Obstetrics & Gynaecology', description: 'Antenatal, postnatal maternity care & women health' },
  { id: 'radiology-sonology', name: 'Radiology & Sonology', description: 'Ultrasound scans, sonography & diagnostic radiology' },
  { id: 'breast-lap-surgery', name: 'General, Breast & Laparoscopic Surgery', description: 'Specialized breast surgery & laparoscopic procedures' },
  { id: 'chest-pulmonology', name: 'General & Chest Medicine (Pulmonology)', description: 'Respiratory care, asthma, chest infection & lung care' },
  { id: 'diabetology', name: 'Diabetology', description: 'Diabetes control, blood sugar regulation & counseling' },
  { id: 'family-medicine', name: 'Family Medicine', description: 'Holistic primary care for all family members' },
  { id: 'gastroenterology', name: 'Gastroenterology & Hepatology', description: 'Liver, stomach acidity, digestive & intestinal health' },
  { id: 'dialysis', name: 'Dialysis', description: 'Hemodialysis support services & renal care' },
  { id: 'ent', name: 'ENT', description: 'Ear, nose, throat & sinus treatment' },
  { id: 'dental', name: 'Dental', description: 'Dental surgery, oral hygiene & preventive dental care' },
];
