"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import financeSlide1 from '@/assets/financeSlide1.avif' 
import financeSlide2 from '@/assets/financeSlide2.webp'
import financeSlide3 from '@/assets/financeSlide3.jpg'

interface CarouselSlide {
  title: string
  subtitle: string
  image: string
  alt: string
}

const slides: CarouselSlide[] = [
  {
    title: "Digital Cash Release Management",
    subtitle: "Streamline your cash flow operations with automated approval workflows and real-time tracking",
    image: financeSlide1.src,
    alt: "Digital cash management dashboard",
  },
  {
    title: "Smart Budget Allocation",
    subtitle: "Optimize your financial resources with AI-powered budgeting and intelligent spending insights",
    image: financeSlide2.src,
    alt: "Budget allocation interface",
  },
  {
    title: "Advanced Financial Analytics",
    subtitle: "Make data-driven decisions with comprehensive reporting and predictive financial modeling",
    image: financeSlide3.src,
    alt: "Financial analytics dashboard",
  },
]

export default function FinanceCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
              }}
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold mb-4 leading-tight">{slide.title}</h2>
                <p className="text-lg text-gray-200 leading-relaxed">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border-0"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white border-0"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-110" : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
