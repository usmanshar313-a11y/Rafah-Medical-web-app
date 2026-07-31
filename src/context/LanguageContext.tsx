import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ur';

export interface Translations {
  bookAppointment: string;
  whatsappConfirm: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  selectService: string;
  selectDoctor: string;
  preferredDate: string;
  reasonVisit: string;
  confirmBooking: string;
  emergencyCall: string;
  open247: string;
  heroSubheading: string;
  accessibility: string;
  trustedBy: string;
  callNow: string;
  [key: string]: string;
}

const enTranslations: Translations = {
  bookAppointment: 'Book Appointment',
  whatsappConfirm: 'Confirm via WhatsApp',
  fullName: 'Full Name',
  phoneNumber: 'Phone Number',
  emailAddress: 'Email Address',
  selectService: 'Select Specialty / Service',
  selectDoctor: 'Select Doctor (Optional)',
  preferredDate: 'Preferred Date',
  reasonVisit: 'Reason for Visit',
  confirmBooking: 'Confirm Appointment',
  emergencyCall: '24/7 Emergency Line',
  open247: '24/7 Emergency Ward',
  heroSubheading: 'Providing compassionate healthcare & modern medical facilities in Karachi',
  accessibility: 'Wheelchair & Stretcher Accessible',
  trustedBy: 'Trusted by over 50,000+ patients across Karachi',
  callNow: 'Call Now: +92 21 36342011',
};

const urTranslations: Translations = {
  bookAppointment: 'اپائنٹمنٹ بک کریں',
  whatsappConfirm: 'واٹس ایپ کے ذریعے تصدیق کریں',
  fullName: 'پورا نام',
  phoneNumber: 'فون نمبر',
  emailAddress: 'ای میل ایڈریس',
  selectService: 'شعبہ یا سروس منتخب کریں',
  selectDoctor: 'ڈاکٹر منتخب کریں (اختیاری)',
  preferredDate: 'ترجیحی تاریخ',
  reasonVisit: 'معائنہ کی وجہ',
  confirmBooking: 'اپائنٹمنٹ کی تصدیق کریں',
  emergencyCall: '24/7 ایمرجنسی لائن',
  open247: '24/7 ایمرجنسی وارڈ',
  heroSubheading: 'کراچی میں جدید طبی سہولیات اور بہترین نگہداشت',
  accessibility: 'ویل چیئر اور اسٹریچر کی سہولت دستیاب',
  trustedBy: 'کراچی میں 50,000 سے زائد مریضوں کا اعتماد',
  callNow: 'ابھی کال کریں: 36342011 21 92+',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = language === 'ur' ? urTranslations : enTranslations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: enTranslations,
    };
  }
  return context;
};
