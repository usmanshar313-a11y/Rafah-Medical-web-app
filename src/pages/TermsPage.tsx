import React from 'react';
import { ShieldCheck, Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0B6B4E] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-emerald-900/10 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B6B4E] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
          Terms of Service & Healthcare Disclaimer
        </h1>

        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
          <div className="font-bold text-sm flex items-center gap-2 text-[#D64545]">
            <Phone className="w-4 h-4" /> Medical Emergency Disclaimer
          </div>
          <p>
            Online appointment booking forms and website requests are NOT intended for immediate life-threatening medical emergencies. If you or a family member are facing a critical emergency, please visit our hospital emergency ward immediately at St-10, Block 13, Gulberg Town, Karachi, or call our 24/7 hotline at +92 21 36342011.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B6B4E]">1. Scope of Clinical Services</h2>
            <p>
              Rafah-E-Aam Medical Centre provides outpatient consultations, diagnostic laboratory testing, maternity care, and round-the-clock emergency triage. Appointment requests submitted online are subject to confirmation by clinic staff based on doctor availability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B6B4E]">2. Patient Records & Accuracy</h2>
            <p>
              Patients are responsible for providing accurate contact numbers and medical history when scheduling visits or uploading previous medical prescriptions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#0B6B4E]">3. Contact Information</h2>
            <p>
              For inquiries, cancellations, or medical assistance, please contact us at +92 21 36342011 or visit our medical center in Gulberg Town, Karachi.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
