'use client';
import { useEffect, useRef } from 'react';

export function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('reveal');
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}
