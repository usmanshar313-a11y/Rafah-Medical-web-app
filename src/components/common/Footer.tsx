import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Accessibility, 
  Star, 
  ShieldCheck, 
  HeartPulse 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B6B4E] text-white pt-12 pb-8 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Clinic Overview & Proof */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#0B6B4E] flex items-center justify-center font-bold">
                <HeartPulse className="w-6 h-6 text-[#0B6B4E]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  Rafah-E-Aam Medical Centre
                </h3>
                <p className="text-xs text-emerald-200">General & Orthopedic Specialist Hospital</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {t.heroSubheading}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-800/80 text-xs font-medium text-emerald-100 border border-emerald-700">
                <Accessibility className="w-3.5 h-3.5 text-emerald-300" />
                {t.accessibility}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-800/80 text-xs font-medium text-emerald-100 border border-emerald-700">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                {t.open247}
              </span>
            </div>

            {/* Social Proof */}
            <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1 text-amber-300 text-sm font-bold">
                  <Star className="w-4 h-4 fill-amber-300" /> 3.8 / 5.0
                </div>
                <div className="text-xs text-emerald-200">{t.trustedBy}</div>
              </div>
              <a
                href="https://www.google.com/maps?q=Rafah-E-Aam+Medical+Center+Karachi"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-200 hover:text-white underline font-semibold"
              >
                Google Reviews
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-emerald-700/60 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-white transition-colors">Departments & Doctors</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Hospital</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact & Location</Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-white transition-colors text-amber-200 font-semibold">
                  Patient Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Services */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-emerald-700/60 pb-2">
              Departments & Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100">
              <li>General Medicine & OPD</li>
              <li>24/7 Emergency Care</li>
              <li>Diagnostics & Laboratory</li>
              <li>Pharmacy (24 Hours)</li>
              <li>Maternity & Gynecological Care</li>
              <li>Pediatrics & Child Health</li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h4 className="font-heading font-bold text-base text-white mb-4 border-b border-emerald-700/60 pb-2">
              Hospital Location
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-emerald-100">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
                <span>St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                <a href="tel:+922136342011" className="hover:underline font-semibold text-white">
                  +92 21 36342011
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Open 24 Hours, 7 Days a Week</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-700/60">
              <a
                href="tel:+922136342011"
                className="w-full bg-[#D64545] hover:bg-[#c23737] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <Phone className="w-3.5 h-3.5" /> Call 24/7 Helpline
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-6 border-t border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200">
          <div>
            © {new Date().getFullYear()} Rafah-E-Aam Medical Center (رفاہ عام میڈیکل سینٹر). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
