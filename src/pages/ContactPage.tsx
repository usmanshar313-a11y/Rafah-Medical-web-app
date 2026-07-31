import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MapPin, Phone, Clock, Accessibility, ExternalLink, Navigation, Mail, MessageSquare, HeartPulse } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (hash === '#map') {
      setTimeout(() => {
        const mapEl = document.getElementById('map-container');
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0B6B4E] pb-20">
      {/* Hero Header */}
      <div className="bg-[#0B6B4E] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-100 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-emerald-600/40">
            <HeartPulse className="w-4 h-4 text-amber-300" />
            <span>Hospital Location & Contact</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Contact & Visit Us
          </h1>
          <p className="text-xs sm:text-base text-emerald-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Conveniently located in Block 13, Gulberg Town, Karachi. Accessible round-the-clock for routine checkups, OPD clinics, and emergency care.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-900/10 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="border-b border-emerald-900/10 pb-3">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B6B4E]">
                  Contact & Address
                </h2>
                <p className="text-xs text-emerald-900/70 mt-1 font-medium">
                  We are available 24/7 to assist you with inquiries, appointments, and emergency care.
                </p>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <MapPin className="w-5 h-5 text-[#D64545] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">Full Address</div>
                    <div className="text-emerald-900/80 leading-snug mt-0.5">
                      St-10, Block 13, Gulberg Town, Karachi, 78500, Pakistan
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <Phone className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">24/7 Phone Helpline</div>
                    <a
                      href="tel:+922136342011"
                      className="text-[#D64545] font-extrabold hover:underline text-sm inline-block mt-0.5"
                    >
                      +92 21 36342011
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <Clock className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">Operating Hours</div>
                    <div className="text-emerald-900/80 leading-snug mt-0.5">
                      Open 24 Hours, 7 Days a Week (OPD + Emergency)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#F5F1E8] rounded-2xl border border-emerald-900/5">
                  <Accessibility className="w-5 h-5 text-[#0B6B4E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0B6B4E]">Accessibility</div>
                    <div className="text-emerald-900/80 leading-snug mt-0.5">
                      Wheelchair accessible entrance, corridors, and rest rooms
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Rafah-E-Aam+Medical+Center+St-10+Block+13+Gulberg+Town+Karachi"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow flex items-center justify-center gap-2 transition-all hover:gap-3 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>
          </motion.div>

          {/* Map Embed */}
          <motion.div 
            id="map-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-emerald-900/10 overflow-hidden min-h-[420px] flex flex-col"
          >
            <div className="bg-[#FAF8F3] px-6 py-4 border-b border-emerald-900/10 flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-[#0B6B4E] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D64545]" />
                Interactive Hospital Map
              </span>
              <span className="text-xs text-emerald-800 font-medium">Gulberg Town, Karachi</span>
            </div>
            <div className="flex-1 min-h-[380px]">
              <iframe
                title="Rafah-E-Aam Medical Center Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.9048385002047!2d67.0805175!3d24.9353723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f37dbbe63eb%3A0xb35a39626e2e5055!2sBlock%2013%20Gulberg%20Town%2C%20Karachi!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
