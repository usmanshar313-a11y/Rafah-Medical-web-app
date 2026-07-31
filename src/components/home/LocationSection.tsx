import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, PhoneCall, Navigation, ArrowRight, HeartPulse } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-16 sm:py-20 bg-[#F5F1E8] text-[#0B6B4E] gsap-reveal">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-900/10 shadow-sm text-center space-y-6"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#FAF8F3] text-[#0B6B4E] text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-900/10">
            <MapPin className="w-4 h-4 text-[#D64545]" />
            <span>Hospital Address & Location</span>
          </div>

          {/* Heading */}
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B6B4E]">
            Want to Connect With Us?
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-base text-emerald-950/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Reach out to our team or find your way to Rafah-E-Aam Medical Centre in Block 13, Gulberg Town, Karachi. We are available 24/7 for your care.
          </p>

          {/* Action Buttons Side-by-Side */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Link
              to="/contact"
              className="w-full sm:w-auto min-w-[160px] bg-[#0B6B4E] hover:bg-[#08523c] active:bg-[#064230] text-white py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs hover:shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/contact#map"
              className="w-full sm:w-auto min-w-[160px] bg-[#FAF8F3] hover:bg-emerald-50 active:bg-emerald-100 text-[#0B6B4E] border border-emerald-900/15 py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#D64545]" />
              <span>Get Directions</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

