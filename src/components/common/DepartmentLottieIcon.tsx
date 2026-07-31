import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { getDepartmentLottieData } from '../../data/departmentLotties';

interface DepartmentLottieIconProps {
  iconType: string;
  className?: string;
  size?: number; // e.g. 40, 48
}

export const DepartmentLottieIcon: React.FC<DepartmentLottieIconProps> = ({
  iconType,
  className = '',
  size = 44,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [lottieData, setLottieData] = useState<any>(null);

  useEffect(() => {
    // Intersection Observer to detect viewport visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px 0px 50px 0px', // Pre-trigger slightly before scrolling into view
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Lazy load the Lottie JSON data when it first comes near viewport
  useEffect(() => {
    if (isInView && !lottieData) {
      const data = getDepartmentLottieData(iconType);
      setLottieData(data);
    }
  }, [isInView, iconType, lottieData]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {lottieData ? (
        <Lottie
          animationData={lottieData}
          loop={true}
          autoplay={isInView} // Pause when off-screen to save CPU & battery
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="rounded-full bg-white/20 animate-pulse"
          style={{ width: size * 0.7, height: size * 0.7 }}
        />
      )}
    </div>
  );
};
