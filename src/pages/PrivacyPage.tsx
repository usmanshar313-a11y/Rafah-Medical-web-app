import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0B6B4E] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-emerald-900/10 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B6B4E] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
          Privacy Policy & Data Security
        </h1>

        <div className="space-y-4 text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
          <p>
            Rafah-E-Aam Medical Centre respects patient privacy and is committed to protecting personal health data and contact records in accordance with healthcare ethics.
          </p>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B6B4E]">1. Information We Collect</h2>
            <p>
              We collect information provided directly by patients when booking appointments, registering on the patient portal, or uploading medical documents. This includes full name, contact number, email address, preferred appointment times, and medical records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B6B4E]">2. How We Use Patient Data</h2>
            <p>
              Patient data is strictly used for scheduling medical consultations, sending appointment confirmations, providing diagnostic report access, and improving patient care services at our Karachi center.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B6B4E]">3. Data Confidentiality</h2>
            <p>
              We do not sell or trade patient personal information to third parties. All patient records are accessible only to authorized medical and administration personnel.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
