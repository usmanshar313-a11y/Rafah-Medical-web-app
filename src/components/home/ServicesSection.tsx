import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  ShieldAlert, 
  FlaskConical, 
  HeartHandshake, 
  Baby, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService?: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = () => {
  return (
    <section id="services" className="py-16 bg-[#e8e2d5] text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="bg-emerald-900/10 text-[#0B6B4E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Clinical Care Preview
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B6B4E]">
            Our Clinical & Medical Services
          </h2>
          <p className="text-xs sm:text-sm text-emerald-950/80">
            Rafah-E-Aam Medical Centre provides high quality medical diagnostics, general OPD, orthopedic surgery, cardiology, maternity, and round-the-clock emergency care.
          </p>
        </div>

        {/* Homepage Summary Card for Services */}
        <div className="bg-[#F5F1E8] rounded-3xl p-8 border border-emerald-900/15 shadow-md max-w-4xl mx-auto space-y-8">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-[#0B6B4E]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#0B6B4E]">General OPD</div>
                <div className="text-[11px] text-emerald-800">Adult & Family Medicine</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-red-100 rounded-xl text-[#D64545]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#0B6B4E]">24/7 Emergency</div>
                <div className="text-[11px] text-red-700 font-semibold">Trauma & Casualty</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-[#0B6B4E]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#0B6B4E]">Orthopedics</div>
                <div className="text-[11px] text-emerald-800">Bones, Joints & Trauma</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-[#0B6B4E]">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#0B6B4E]">Diagnostics</div>
                <div className="text-[11px] text-emerald-800">Ultrasound & Lab</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-[#0B6B4E]">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#0B6B4E]">Pediatrics</div>
                <div className="text-[11px] text-emerald-800">Child & Neonatal Care</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-900/10 flex items-center gap-3 shadow-xs">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-[#0B6B4E]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-xs sm:text-sm text-[#0B6B4E]">Surgery</div>
                <div className="text-[11px] text-emerald-800">Laparoscopic & General</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-900 font-medium text-center sm:text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Over 15+ specialized medical departments and diagnostic units available.</span>
            </div>

            <Link
              to="/services"
              className="w-full sm:w-auto bg-[#0B6B4E] hover:bg-[#08523c] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:gap-3"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
