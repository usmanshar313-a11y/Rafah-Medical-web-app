import React, { useEffect, useState, useRef } from 'react';
import { 
  Stethoscope, 
  ShieldAlert, 
  FlaskConical, 
  Pill, 
  Baby, 
  HeartHandshake, 
  Calendar, 
  ChevronRight,
  Search,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';
import { BookingModal } from '../components/booking/BookingModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const DEFAULT_SERVICES: Service[] = [

  {
    id: 'gen-physician',
    name: 'General Physician',
    description: 'Comprehensive adult outpatient care, hypertension control, fever management, diabetes screening, and general medical checkups.',
    icon: 'stethoscope',
    department: 'Outpatient Care',
  },
  {
    id: 'orthopedics',
    name: 'Orthopedic Surgery',
    description: 'Specialized bone and joint consultations, fracture management, spinal care, arthritis treatment, and orthopedic trauma care.',
    icon: 'stethoscope',
    department: 'Orthopedics',
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Expert cardiac care, ECG diagnostics, hypertension management, heart health screening, and cardiovascular consultations.',
    icon: 'heart',
    department: 'Heart Care',
  },
  {
    id: 'gen-lap-surgery',
    name: 'General & Laparoscopic Surgery',
    description: 'Minimally invasive laparoscopic procedures, hernia repair, gallbladder surgery, appendectomy, and routine surgical care.',
    icon: 'stethoscope',
    department: 'Surgery',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics (Child Specialist)',
    description: 'Dedicated healthcare for infants, toddlers, and adolescents, growth monitoring, and routine childhood immunizations.',
    icon: 'baby',
    department: 'Child Health',
  },
  {
    id: 'obs-gyn',
    name: 'Obstetrics & Gynaecology',
    description: 'Antenatal and postnatal maternity care, women reproductive health, safe deliveries, and gynecological consultations.',
    icon: 'heart',
    department: 'Maternity & Women',
  },
  {
    id: 'radiology-sonology',
    name: 'Radiology & Sonology',
    description: 'High-precision diagnostic ultrasound scans, pelvic and abdominal sonography, Doppler imaging, and radiology services.',
    icon: 'flask',
    department: 'Diagnostics',
  },
  {
    id: 'breast-lap-surgery',
    name: 'General, Breast & Laparoscopic Surgery',
    description: 'Specialized breast surgery, tumor screening, endocrine surgical procedures, and advanced laparoscopic surgeries.',
    icon: 'stethoscope',
    department: 'Surgical Oncology',
  },
  {
    id: 'chest-pulmonology',
    name: 'General & Chest Medicine (Pulmonology)',
    description: 'Expert treatment for asthma, chronic bronchitis, chest infections, tuberculosis, and respiratory health disorders.',
    icon: 'stethoscope',
    department: 'Respiratory Care',
  },
  {
    id: 'diabetology',
    name: 'Diabetology',
    description: 'Comprehensive diabetes management, blood glucose regulation, diabetic neuropathy care, and dietary counseling.',
    icon: 'stethoscope',
    department: 'Endocrine Care',
  },
  {
    id: 'family-medicine',
    name: 'Family Medicine',
    description: 'Holistic primary healthcare services for patients of all ages, preventive health checks, and chronic disease management.',
    icon: 'stethoscope',
    department: 'Primary Care',
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology & Hepatology',
    description: 'Consultations for stomach acidity, liver diseases, hepatitis, peptic ulcers, gallbladder disorders, and digestive health.',
    icon: 'flask',
    department: 'Digestive Health',
  },
  {
    id: 'dialysis',
    name: 'Dialysis',
    description: 'Hemodialysis support services, renal failure care, kidney function monitoring, and specialized nephrology support.',
    icon: 'flask',
    department: 'Renal Care',
  },
  {
    id: 'ent',
    name: 'ENT',
    description: 'Ear, nose, and throat consultations, sinus relief, tonsillitis treatment, hearing evaluations, and nasal disorder care.',
    icon: 'stethoscope',
    department: 'Ear, Nose & Throat',
  },
  {
    id: 'dental',
    name: 'Dental',
    description: 'Comprehensive oral healthcare, dental surgery, tooth extractions, root canal consultations, and preventive dental checkups.',
    icon: 'stethoscope',
    department: 'Dental Surgery',
  },
];

export const ServicesPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  useScrollAnimation(containerRef, '.gsap-reveal');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, 'services'));
        const fetched: Service[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Service);
        });
        if (fetched.length > 0) {
          setServices(fetched);
        }
      } catch (e) {
        console.log('Using default services list');
      }
    };
    fetchServices();
  }, []);

  const handleOpenBooking = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'shield-alert':
        return <ShieldAlert className="w-6 h-6 text-[#D64545]" />;
      case 'flask':
        return <FlaskConical className="w-6 h-6 text-[#0B6B4E]" />;
      case 'pill':
        return <Pill className="w-6 h-6 text-[#0B6B4E]" />;
      case 'baby':
        return <Baby className="w-6 h-6 text-[#0B6B4E]" />;
      case 'heart':
        return <HeartHandshake className="w-6 h-6 text-[#0B6B4E]" />;
      default:
        return <Stethoscope className="w-6 h-6 text-[#0B6B4E]" />;
    }
  };

  const departments = ['All', ...Array.from(new Set(services.map((s) => s.department).filter(Boolean)))];

  const filteredServices = services.filter((serv) => {
    const matchesDept = selectedDept === 'All' || serv.department === selectedDept;
    const matchesSearch =
      serv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (serv.department && serv.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div ref={containerRef} className="bg-[#F5F1E8] min-h-screen py-10 text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="bg-[#0B6B4E] text-white p-8 rounded-3xl shadow-lg border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6 gsap-reveal">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="bg-emerald-800 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Rafah-E-Aam Medical Departments
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              All Medical Services & Clinical Care
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Explore our full range of general, specialist, diagnostic, and emergency clinical services offered at Rafah-E-Aam Medical Centre.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="tel:+922136342011"
              className="w-full sm:w-auto bg-[#D64545] hover:bg-[#c23737] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> 24/7 Helpline (+92 21 36342011)
            </a>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search services or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F5F1E8] border border-emerald-900/20 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
            />
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept as string)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#0B6B4E] text-white shadow-xs'
                    : 'bg-[#F5F1E8] text-[#0B6B4E] hover:bg-emerald-900/10'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center space-y-3 border border-emerald-900/10 gsap-reveal">
            <p className="font-heading font-bold text-lg text-emerald-900">No matching services found</p>
            <p className="text-xs text-emerald-700">Try searching for a different service name or department.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedDept('All'); }}
              className="bg-[#0B6B4E] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#08523c]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gsap-reveal">
            {filteredServices.map((serv) => (
              <div
                key={serv.id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-emerald-900/10 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-[#F5F1E8] rounded-xl group-hover:scale-105 transition-transform">
                      {getIconComponent(serv.icon)}
                    </div>
                    {serv.department && (
                      <span className="text-[11px] font-bold bg-emerald-900/10 px-2.5 py-0.5 rounded-full text-[#0B6B4E]">
                        {serv.department}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#0B6B4E]">
                    {serv.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed">
                    {serv.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Available for walk-in & appointments</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-emerald-900/10">
                  <button
                    onClick={() => handleOpenBooking(serv.id)}
                    className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Service Appointment</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
};
