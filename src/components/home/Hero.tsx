import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Phone, 
  Accessibility,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
// HERO BACKGROUND IMAGE CONFIGURATION
// To manually change the background image:
// Option 1: Update the import statement below to point to a new image file in your src/assets folder
// Option 2: Set HERO_BACKGROUND_IMAGE directly to an external URL or static asset path (e.g., HERO_BACKGROUND_IMAGE = 'https://your-domain.com/image.jpg')
import heroReceptionImg from '../../assets/images/hero_reception_1785393482596.jpg';

const HERO_BACKGROUND_IMAGE = heroReceptionImg;

interface HeroProps {
  onOpenBooking?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-[520px] lg:min-h-[580px] flex items-center pt-12 pb-20 lg:py-28 overflow-hidden text-white">
      {/* Hero Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt="Rafah-E-Aam Medical Centre hero background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105"
        />
        {/* Balanced Dark Overlay to Ensure Crisp Text Contrast Across Whole Section */}
        <div className="absolute inset-0 bg-[#032d20]/70 sm:bg-[#032d20]/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#032d20]/80 via-transparent to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-3xl space-y-6 gsap-reveal text-center mx-auto">
          
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 text-emerald-200 font-extrabold text-xs sm:text-sm tracking-wider uppercase bg-emerald-950/80 border border-emerald-500/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-md mx-auto">
              <Clock className="w-4 h-4 text-amber-300" />
              Compassionate Care, Available 24/7
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-sm text-center">
              Rafah-E-Aam Medical Centre
              <span className="text-amber-300 text-2xl sm:text-4xl lg:text-5xl font-extrabold block mt-2 sm:mt-3 drop-shadow">
                General & Orthopedic
              </span>
            </h1>
          </div>

          <p className="text-emerald-100 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow-xs font-medium text-center">
            Trusted healthcare in Gulberg Town. Providing state-of-the-art OPD diagnostics, surgery, and maternal care with a human touch in our modern reception & clinical facilities.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                navigate('/departments');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-[#D64545] hover:bg-[#c23737] text-white px-8 py-3.5 rounded-full text-base font-bold shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>{t.bookAppointment}</span>
            </button>

            <a
              href="tel:+922136342011"
              className="w-full sm:w-auto bg-white hover:bg-emerald-50 text-[#0B6B4E] px-7 py-3.5 rounded-full text-base font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5 text-[#D64545]" />
              <span>{t.callNow}</span>
            </a>
          </div>

          {/* Feature Badges */}
          <div className="pt-4 border-t border-white/20 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2.5 bg-emerald-950/70 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-400/30 text-white shadow-xs">
              <Accessibility className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">Full Wheelchair Accessibility</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-950/70 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-400/30 text-white shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">St-10, Block 13, Gulberg Town</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

