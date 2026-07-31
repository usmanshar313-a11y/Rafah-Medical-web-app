import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollAnimation(containerRef?: React.RefObject<HTMLElement | null>, selector = '.gsap-reveal') {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef?.current
        ? containerRef.current.querySelectorAll(selector)
        : document.querySelectorAll(selector);

      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef || undefined);

    return () => ctx.revert();
  }, [containerRef, selector]);
}
