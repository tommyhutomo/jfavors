'use client';
import { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function PortfolioCarousel() {
  const ref = useScrollReveal();
  const [currentIndex, setCurrentIndex] = useState(0);

  const portfolioItems = [
    {
      id: 1,
      title: 'Corporate Conference 2024',
      category: 'Conference',
      description: 'A large-scale corporate conference with 500+ attendees.',
    },
    {
      id: 2,
      title: 'Product Launch Event',
      category: 'Product Launch',
      description: 'Exciting product launch event with live demonstrations.',
    },
    {
      id: 3,
      title: 'Team Building Retreat',
      category: 'Team Building',
      description: 'Fun and engaging team building activities for 200 employees.',
    },
    {
      id: 4,
      title: 'Exhibition & Trade Show',
      category: 'Exhibition',
      description: 'Professional exhibition with vendor booths and networking.',
    },
    {
      id: 5,
      title: 'Gala Dinner Event',
      category: 'Gala',
      description: 'Elegant gala dinner with 300 distinguished guests.',
    },
    {
      id: 6,
      title: 'Virtual Event Summit',
      category: 'Virtual',
      description: 'Hybrid event combining in-person and virtual attendees.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % portfolioItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [portfolioItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % portfolioItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + portfolioItems.length) % portfolioItems.length);
  };

  const visibleItems = [
    portfolioItems[currentIndex],
    portfolioItems[(currentIndex + 1) % portfolioItems.length],
    portfolioItems[(currentIndex + 2) % portfolioItems.length],
  ];

  return (
    <section className="section container-max" ref={ref}>
      <h2 className="heading-2 mb-2 text-center">Featured Portfolio</h2>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Discover some of our most successful events and projects.
      </p>

      <div className="relative">
        {/* Main carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              className={`card overflow-hidden transition-all duration-300 ${
                index === 0 ? 'md:col-span-1 md:scale-105 ring-2 ring-brand/20' : 'opacity-75'
              }`}
            >
              <div className="bg-gradient-to-br from-pink-200 to-purple-200 h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {item.category === 'Conference' && '🎤'}
                    {item.category === 'Product Launch' && '🚀'}
                    {item.category === 'Team Building' && '👥'}
                    {item.category === 'Exhibition' && '🏛️'}
                    {item.category === 'Gala' && '✨'}
                    {item.category === 'Virtual' && '💻'}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-full mb-2">
                  {item.category}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-brand text-white hover:bg-brand/90 transition-colors"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex gap-2">
            {portfolioItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-brand w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-brand text-white hover:bg-brand/90 transition-colors"
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View all button */}
        <div className="text-center">
          <a href="/portfolio" className="btn">
            View All Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
