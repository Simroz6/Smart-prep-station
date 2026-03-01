import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80',
    title: 'AKUEB Past Papers',
    subtitle: 'Expertly Solved Resources',
    description: 'Latest past papers with detailed marking schemes for all subjects.',
    cta: 'Shop Past Papers',
    link: '/products?category=past-papers',
    bgColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=1200&q=80',
    title: 'Comprehensive Notes',
    subtitle: 'Simplified for Success',
    description: 'High-quality notes covering the entire AKUEB syllabus.',
    cta: 'Browse Notes',
    link: '/products?category=notes',
    bgColor: 'from-blue-500 to-indigo-600'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80',
    title: 'Full Bundle Deals',
    subtitle: 'Best Value Preparation',
    description: 'Get Past Papers, Notes, and SLOs in one discounted pack.',
    cta: 'View Bundles',
    link: '/products?category=bundles',
    bgColor: 'from-orange-500 to-red-600'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Auto-slide disabled - removed animation interval
    return () => {};
  }, []);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const current = slides[currentSlide];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Slide Content */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${current.bgColor} opacity-80`} />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-4">
              {current.subtitle}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {current.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              {current.description}
            </p>
            <Link
              to={current.link}
              className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {current.cta}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
