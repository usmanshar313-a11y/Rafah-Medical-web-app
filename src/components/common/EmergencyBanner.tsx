import React from 'react';
import { Phone, Clock, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const EmergencyBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#D64545] text-white py-2 px-4 shadow-sm z-50 text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 animate-pulse shrink-0" />
          <span className="font-semibold">{t.emergencyCall}:</span>
          <a
            href="tel:+922136342011"
            className="underline font-bold hover:text-red-100 transition-colors flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5 inline" /> +92 21 36342011
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs opacity-95">
          <span className="flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
            <Clock className="w-3.5 h-3.5" /> {t.open247}
          </span>
          <span className="hidden md:inline">St-10, Block 13, Gulberg Town, Karachi</span>
        </div>
      </div>
    </div>
  );
};
