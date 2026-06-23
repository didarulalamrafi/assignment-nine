"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BsArrowRight, BsChevronLeft, BsChevronRight } from "react-icons/bs";

const slides = [
  {
    id: 1,
    title: "Learn from Industry Experts",
    description:
      "Get personalized 1-on-1 tutoring from experienced professionals in any field",
    image:
      "https://images.unsplash.com/photo-1588696254927-e79ea3dcd7f2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Find a Tutor",
    ctaLink: "/tutors",
  },
  {
    id: 2,
    title: "Master Any Subject",
    description:
      "From Mathematics to Music, find expert tutors for over 100+ subjects",
    image:
      "https://plus.unsplash.com/premium_photo-1664910790735-cde4270a0b42?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ctaText: "Quick Start",
    ctaLink: "/tutors",
  },
  {
    id: 3,
    title: "Flexible Learning Schedule",
    description:
      "Book sessions that fit your timetable - learn anytime, anywhere",
    image:
      "https://cdn.pixabay.com/photo/2024/09/05/19/46/ai-generated-9025826_960_720.jpg",
    ctaText: "Get Started",
    ctaLink: "/register",
  },
  {
    id: 4,
    title: "Learn from Industry Experts",
    description:
      "Get personalized 1-on-1 tutoring from experienced professionals in any field",
    image:
      "https://cdn.pixabay.com/photo/2026/05/16/15/05/norman_gil-ai-generated-10283012_1280.png",
    ctaText: "Find a Tutor",
    ctaLink: "/tutors",
  },
];

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section
      className="relative overflow-hidden w-full"
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-110 sm:h-150 md:h-180 lg:h-200 w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative min-w-full h-full shrink-0 @container"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              <div className="absolute inset-0 bg-black/60 sm:bg-black/50" />

              <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-8">
                <div className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center">
                  <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-sky-600/90 text-white mb-4 sm:mb-6 tracking-wide uppercase">
                    Online Tutor Booking Platform
                  </span>

                  <h1 className="text-xl @xs:text-2xl @sm:text-3xl @md:text-4xl @lg:text-5xl @xl:text-6xl font-extrabold text-white leading-tight mb-3 sm:mb-4 md:mb-6 px-2">
                    {slide.title}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-xl mx-auto px-2 sm:px-6">
                    {slide.description}
                  </p>

                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
                  >
                    {slide.ctaText}
                    <BsArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition z-20 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <BsChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition z-20 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <BsChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full h-2 ${
              currentSlide === index
                ? "w-6 sm:w-8 bg-sky-500"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="sm:hidden absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-[10px] tracking-wider pointer-events-none">
        ← Swipe to navigate →
      </div>
    </section>
  );
}


// image:
//   "https://images.pexels.com/photos/6929180/pexels-photo-6929180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
