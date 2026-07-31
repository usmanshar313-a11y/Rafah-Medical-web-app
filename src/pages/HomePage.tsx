import React, { useState, useRef } from 'react';
import { Hero } from '../components/home/Hero';
import { AboutSection } from '../components/home/AboutSection';
import { DepartmentsSection } from '../components/home/DepartmentsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LocationSection } from '../components/home/LocationSection';
import { BookingModal } from '../components/booking/BookingModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);

  useScrollAnimation(containerRef, '.gsap-reveal');

  const handleOpenGeneralBooking = () => {
    setSelectedDoctorId(undefined);
    setSelectedServiceId(undefined);
    setBookingModalOpen(true);
  };

  return (
    <div ref={containerRef} className="space-y-0">
      <Hero onOpenBooking={handleOpenGeneralBooking} />
      <AboutSection />
      <DepartmentsSection onOpenBooking={handleOpenGeneralBooking} />
      <TestimonialsSection />
      <LocationSection />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedDoctorId={selectedDoctorId}
        preselectedServiceId={selectedServiceId}
      />
    </div>
  );
};

