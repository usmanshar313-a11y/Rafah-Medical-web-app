import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Doctor } from '../../types';

interface DoctorsSectionProps {
  onSelectDoctor: (doctorId: string) => void;
}

const FEATURED_DOCTORS_FALLBACK: Doctor[] = [
  { 
    id: 'doc-3', 
    name: 'Dr. Wajid Ali', 
    specialty: 'Consultant Cardiologist & Physician',
    photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    availableDays: 'Mon, Wed, Fri',
    timing: '06:00 PM - 09:00 PM'
  },
  { 
    id: 'doc-4', 
    name: 'Dr. S. Kashif Mateen', 
    specialty: 'Consultant General & Laparoscopic Surgeon',
    photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    availableDays: 'Tue, Thu, Sat',
    timing: '05:00 PM - 08:00 PM'
  },
  { 
    id: 'doc-22', 
    name: 'Dr. Erum Kazim', 
    specialty: 'General, Breast & Laparoscopic Surgeon',
    bio: 'Assistant Professor Surgery, Dow University of Health Sciences & Civil Hospital Karachi',
    photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    availableDays: 'Mon - Sat',
    timing: '04:00 PM - 07:00 PM'
  },
];

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onSelectDoctor }) => {
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>(FEATURED_DOCTORS_FALLBACK);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snap = await getDocs(collection(db, 'doctors'));
        const fetched: Doctor[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Doctor);
        });
        if (fetched.length >= 3) {
          setFeaturedDoctors(fetched.slice(0, 3));
        }
      } catch (e) {
        console.warn('Using featured doctors fallback');
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section id="doctors" className="py-16 bg-[#F5F1E8] text-[#0B6B4E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="bg-emerald-900/10 text-[#0B6B4E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Featured Specialist Panel
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B6B4E]">
            Meet Our Top Medical Consultants
          </h2>
          <p className="text-xs sm:text-sm text-emerald-950/80">
            A preview of our senior consultants and surgical specialists. View our full doctor panel to search all 34+ specialists.
          </p>
        </div>

        {/* 3 Featured Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-emerald-900/10 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-emerald-100 relative overflow-hidden">
                  <img
                    src={doc.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                    alt={doc.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                  {doc.roomNumber && (
                    <span className="absolute bottom-2 right-2 bg-[#0B6B4E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      {doc.roomNumber}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-heading font-bold text-base text-[#0B6B4E]">
                    {doc.name}
                  </h3>
                  <div className="text-xs font-bold text-[#D64545] bg-red-50 px-2 py-0.5 rounded-md inline-block">
                    {doc.specialty}
                  </div>
                  {doc.bio && (
                    <p className="text-xs text-emerald-900/70 line-clamp-2 leading-relaxed pt-1">
                      {doc.bio}
                    </p>
                  )}

                  {doc.timing && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium pt-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Timing: {doc.timing}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onSelectDoctor(doc.id)}
                  className="w-full bg-[#D64545] hover:bg-[#c23737] text-white py-2 rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Doctors CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 bg-[#0B6B4E] hover:bg-[#08523c] text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>View All Doctors (34+ Panel)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
