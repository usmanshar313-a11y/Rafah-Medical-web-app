import React, { useEffect, useRef } from 'react';
import { 
  Building2, 
  Clock, 
  Accessibility, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  ArrowRight,
  GraduationCap,
  Ambulance,
  Bed,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

import aboutSeminarImg from '../assets/images/about_seminar_1785393494261.jpg';
import emergencyAmbulanceImg from '../assets/images/emergency_ambulance_1785393504809.jpg';
import facilityTreatmentImg from '../assets/images/facility_treatment_1785393518585.jpg';
import facilityPatientRoomImg from '../assets/images/facility_patient_room_1785393530865.jpg';

export const AboutPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useScrollAnimation(containerRef, '.gsap-reveal');

  return (
    <div ref={containerRef} className="bg-[#F5F1E8] min-h-screen py-10 text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Banner Header */}
        <div className="bg-[#0B6B4E] text-white p-8 sm:p-10 rounded-3xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6 gsap-reveal">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
              About Rafah-E-Aam Medical Centre
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Dedicated to Serving Gulberg Town & Karachi
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Providing round-the-clock emergency care, general OPD consultations, orthopedic surgery, maternal healthcare, and diagnostic services with compassionate human touch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="tel:+922136342011"
              className="w-full sm:w-auto bg-[#D64545] hover:bg-[#c23737] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors shrink-0"
            >
              <Phone className="w-4 h-4" /> 24/7 Helpline (+92 21 36342011)
            </a>
          </div>
        </div>

        {/* Main Hospital Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center gsap-reveal">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-900/10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/10 text-xs font-bold uppercase tracking-wider text-[#0B6B4E]">
                <Building2 className="w-4 h-4" /> Community Healthcare Legacy
              </div>

              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0B6B4E]">
                Our Mission & Healthcare Commitment
              </h2>

              <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                Rafah-E-Aam Medical Centre was established with a clear mission: to make affordable, high-quality, and ethical healthcare accessible to every family in Gulberg Town and greater Karachi. Located conveniently at St-10, Block 13, Gulberg Town, our facility operates 24 hours a day, 7 days a week, offering continuous medical supervision.
              </p>

              <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                From emergency casualty care and minor trauma stabilization to advanced laparoscopic surgeries, pediatric care, and maternity services, our team of over 34+ senior consultants and qualified staff ensure patient dignity, speed, and accuracy at every step.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 text-center">
                  <div className="font-extrabold text-xl text-[#0B6B4E]">24/7</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Emergency & Lab</div>
                </div>
                <div className="p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 text-center">
                  <div className="font-extrabold text-xl text-[#0B6B4E]">34+</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Medical Specialists</div>
                </div>
                <div className="p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 text-center col-span-2 sm:col-span-1">
                  <div className="font-extrabold text-xl text-[#0B6B4E]">15+</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Specialized OPDs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Feature Highlights Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-900/10 space-y-6">
              <h3 className="font-heading font-bold text-lg text-[#0B6B4E] border-b pb-3">
                Key Hospital Facilities
              </h3>

              <ul className="space-y-3.5 text-xs sm:text-sm font-medium text-emerald-900">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">24/7 Emergency & Triage Ward</span>
                    <span className="text-emerald-800/80 text-[11px]">Equipped for immediate trauma control and acute care.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">Orthopedic & General Surgery</span>
                    <span className="text-emerald-800/80 text-[11px]">Specialized fracture care, joint consultations & laparoscopic procedures.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">Diagnostic Laboratory & Ultrasound</span>
                    <span className="text-emerald-800/80 text-[11px]">In-house sonography, pelvic & abdominal imaging, and pathology testing.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#0B6B4E]">Wheelchair & Patient Accessibility</span>
                    <span className="text-emerald-800/80 text-[11px]">Wheelchair ramps, accessible entrances, and friendly support staff.</span>
                  </div>
                </li>
              </ul>

              <div className="pt-2">
                <div className="p-4 bg-[#F5F1E8] rounded-2xl border border-emerald-900/10 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block text-[#0B6B4E]">Hospital Location:</span>
                    <span className="text-emerald-900">St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Clinical Excellence & Continuing Staff Education Section (Requirement #2) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-900/10 shadow-sm gsap-reveal">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl shadow-md border border-emerald-900/10">
              <img
                src={aboutSeminarImg}
                alt="Medical seminar and staff training presentation at Rafah-E-Aam Medical Centre"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs px-3.5 py-2 rounded-xl text-[11px] font-bold text-[#0B6B4E] border border-emerald-900/10">
                Regular Clinical Seminars & Guideline Workshops
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B6B4E] bg-emerald-100/80 px-3.5 py-1 rounded-full uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-[#0B6B4E]" /> Clinical Excellence & Education
              </span>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B6B4E]">
                Continuous Medical Education & Staff Training
              </h2>

              <p className="text-xs sm:text-sm text-emerald-950/85 leading-relaxed">
                At Rafah-E-Aam Medical Centre, continuous medical education and clinical updates are central to our care model. Our senior medical consultants regularly conduct clinical seminars and guideline presentations—covering ACC/AHA cardiology protocols, emergency triage standards, and surgical safety—to ensure our healthcare staff delivers up-to-date, evidence-based care to every patient.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-emerald-900">
                <div className="flex items-center gap-2 bg-[#F5F1E8] p-3 rounded-xl border border-emerald-900/10">
                  <ShieldCheck className="w-4 h-4 text-[#0B6B4E] shrink-0" />
                  <span>Evidence-Based Treatment Guidelines</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F5F1E8] p-3 rounded-xl border border-emerald-900/10">
                  <Sparkles className="w-4 h-4 text-[#0B6B4E] shrink-0" />
                  <span>Continuous Staff Quality Audits</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 24/7 Emergency & Rapid Ambulance Rescue Section (Requirement #3) */}
        <div className="bg-[#0B6B4E] text-white rounded-3xl p-6 sm:p-10 border border-emerald-800 shadow-md gsap-reveal">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 order-2 lg:order-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-emerald-800/80 px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Ambulance className="w-4 h-4 text-amber-300" /> Rapid Emergency Rescue
              </span>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                24/7 Emergency Response & Ambulance Service
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Our emergency response unit operates 24 hours a day with certified paramedics and fully equipped life-support ambulances. Whether responding to acute trauma, cardiac distress, or urgent patient transfers in Gulberg Town and surrounding areas, our rapid dispatch team ensures safe and swift arrival.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-100">
                <div className="flex items-center gap-2 bg-emerald-800/60 px-3.5 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-amber-300" /> 24/7 Paramedic Dispatch
                </div>
                <div className="flex items-center gap-2 bg-emerald-800/60 px-3.5 py-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-amber-300" /> Advanced Life Support Equipment
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 relative group overflow-hidden rounded-2xl shadow-lg border-2 border-emerald-700">
              <img
                src={emergencyAmbulanceImg}
                alt="Paramedic and equipped ambulance for 24/7 emergency rescue services at Rafah-E-Aam Medical Centre"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs px-3.5 py-2 rounded-xl text-[11px] font-bold text-white border border-white/20">
                On-Call Paramedic Rescue Team
              </div>
            </div>

          </div>
        </div>

        {/* Facility Gallery Section (Requirement #4) */}
        <div className="space-y-6 gsap-reveal">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B6B4E] bg-emerald-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Bed className="w-4 h-4 text-[#0B6B4E]" /> Hospital Tour
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B6B4E]">
              Our Medical Facilities
            </h2>
            <p className="text-xs sm:text-sm text-emerald-950/80">
              Take a look inside our clean, modern treatment bays, inpatient care rooms, and clinical environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gallery Item 1: Treatment Rooms */}
            <div className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative overflow-hidden h-64 sm:h-72">
                <img
                  src={facilityTreatmentImg}
                  alt="Modern treatment room at Rafah-E-Aam Medical Centre"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0B6B4E] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Clinical Ward
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-heading font-bold text-lg text-[#0B6B4E]">
                  Modern Treatment Rooms
                </h3>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  Equipped with multi-parameter diagnostic monitors, ECG equipment, and private bay curtains for patient dignity during examinations.
                </p>
              </div>
            </div>

            {/* Gallery Item 2: Patient Wards */}
            <div className="bg-white rounded-3xl overflow-hidden border border-emerald-900/10 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="relative overflow-hidden h-64 sm:h-72">
                <img
                  src={facilityPatientRoomImg}
                  alt="Comfortable patient care room at Rafah-E-Aam Medical Centre"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0B6B4E] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Inpatient Care
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-heading font-bold text-lg text-[#0B6B4E]">
                  Comfortable Patient Care Areas
                </h3>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  Quiet, sanitized inpatient wards designed for restful recovery, continuous vital monitoring, and 24/7 nursing supervision.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Actions Navigation Banner */}
        <div className="bg-[#0B6B4E] rounded-3xl p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 gsap-reveal">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-xl text-white">Need Specialist Medical Advice?</h3>
            <p className="text-xs text-emerald-100">Explore our doctors or schedule a visit with our medical reception team.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/doctors"
              className="bg-white hover:bg-emerald-50 text-[#0B6B4E] font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              View Specialist Panel
            </Link>
            <Link
              to="/services"
              className="bg-[#D64545] hover:bg-[#c23737] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

