import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  Building2
} from 'lucide-react';

interface DepartmentsSectionProps {
  onOpenBooking?: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = () => {
  const FEATURED_DEPARTMENTS = [
    {
      id: 'gen-opd',
      name: 'General OPD & Internal Medicine',
      doctors: 'Dr. Ajmaal Jami, Dr. Saqib Zain, Dr. Bushra Rabbani',
      timing: '09:00 AM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,000',
      icon: Stethoscope,
      bg: 'bg-[#0B6B4E]/10 text-[#0B6B4E]'
    },
    {
      id: 'cardiology',
      name: 'Cardiology & Heart Care',
      doctors: 'Dr. Wajid Ali, Dr. Syed Saadat Ali, Dr. Usman Alam',
      timing: '02:00 PM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,500',
      icon: Heart,
      bg: 'bg-red-50 text-[#D64545]'
    },
    {
      id: 'orthopedics',
      name: 'Orthopedics & Joint Surgery',
      doctors: 'Dr. Akhtar Baig',
      timing: '06:00 PM – 09:00 PM',
      days: 'Mon – Sat',
      fee: 'Rs. 1,500',
      icon: Activity,
      bg: 'bg-[#0B6B4E]/10 text-[#0B6B4E]'
    }
  ];

  return (
    <section id="departments" className="py-20 bg-[#e8e2d5] text-[#0B6B4E] gsap-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto space-y-4"
        >
          <span className="bg-emerald-900/10 text-[#0B6B4E] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0B6B4E]" />
            Featured Medical Services
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B6B4E]">
            Specialized Departments & Doctors
          </h2>
          <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
            Rafah-E-Aam Medical Centre provides 15+ specialized medical departments and 34+ senior consultant doctors. Explore featured specialties or view our complete department schedule.
          </p>
        </motion.div>

        {/* 3 Featured Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {FEATURED_DEPARTMENTS.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white p-6 rounded-3xl border border-emerald-900/10 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl ${dept.bg} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold text-[#0B6B4E] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                      Fee: {dept.fee}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0B6B4E] leading-snug">
                    {dept.name}
                  </h3>

                  <div className="bg-[#FAF8F3] p-3.5 rounded-2xl border border-emerald-900/5 text-xs text-emerald-900/90 leading-relaxed">
                    <span className="font-bold text-[#0B6B4E]">Senior Consultants: </span>
                    {dept.doctors}
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-900/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-emerald-900">
                    <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" /> OPD Days:
                    </span>
                    <span className="font-bold text-[#0B6B4E]">{dept.days}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-900">
                    <span className="text-emerald-800 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" /> Timings:
                    </span>
                    <span className="font-bold text-[#0B6B4E]">{dept.timing}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3 text-xs sm:text-sm text-emerald-950 font-medium text-center sm:text-left">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Discover all 15+ specialized departments, 34+ senior consultant profiles, room numbers, and fees.</span>
          </div>

          <Link
            to="/departments"
            className="w-full sm:w-auto bg-[#0B6B4E] hover:bg-[#08523c] text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:gap-3 shrink-0"
          >
            <span>View All Departments & Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
