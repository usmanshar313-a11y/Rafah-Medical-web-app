import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Clock, CheckCircle2, ArrowRight, Accessibility } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 bg-[#F5F1E8] text-[#0B6B4E] gsap-reveal">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Standalone Badges & Heading Group */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#0B6B4E] font-extrabold text-xs tracking-wider uppercase bg-[#0B6B4E]/10 px-4 py-1.5 rounded-full">
              <Building2 className="w-4 h-4 text-[#0B6B4E]" />
              About Our Centre
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white px-3.5 py-1.5 rounded-full border border-emerald-900/15 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#D64545]" />
              <span>Open 24/7 in Gulberg Town</span>
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0B6B4E] leading-tight">
            Rafah-E-Aam Medical Centre
          </h2>
        </motion.div>

        {/* Breathable Unboxed Description Paragraph */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="text-emerald-950/85 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
        >
          Located at St-10, Block 13, Gulberg Town, Karachi, Rafah-E-Aam Medical Centre is a trusted community institution delivering 24/7 emergency triage, orthopedic surgery, maternal care, and specialist OPD consultations across 15+ departments.
        </motion.p>

        {/* Feature Highlights as Clean Inline Badge Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2"
        >
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-emerald-900/10 shadow-2xs text-xs sm:text-sm font-bold text-[#0B6B4E]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>34+ Specialist Doctors Panel</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-emerald-900/10 shadow-2xs text-xs sm:text-sm font-bold text-[#0B6B4E]">
            <Accessibility className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Full Wheelchair Accessibility</span>
          </div>
        </motion.div>

        {/* Learn More Button CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pt-4"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2 bg-[#0B6B4E] hover:bg-[#08523c] text-white px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer hover:gap-3"
          >
            <span>Learn More About Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
