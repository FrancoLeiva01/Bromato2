"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LoaderContent } from "@/components/LoaderComponent"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeaderProps {
  username?: string
  images?: string[]
}

const Header: React.FC<HeaderProps> = ({
  images = [
    "/src/assets/bromato.png",
    "/src/assets/restaurant-kitchen-hygiene.jpg",
    "/src/assets/food-safety-inspection.jpg",
  ],
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
   {/* Loader*/}
   
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])


  {/* Carrusel */}

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <LoaderContent isLoading={isLoading} loadingText="Cargando Inicio..." minHeight="400px">
      <div className="relative w-full mb-8 rounded-lg overflow-hidden">
        {/* Carrusel*/}
        <div className="relative h-96">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <header className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
                <div className="flex flex-col items-center justify-center text-center h-full bg-black/50">
                  <h1 className="text-4xl md:text-6xl font-extrabold capitalize text-gray-200 drop-shadow-lg">
                Bienvenidos!
                  </h1>
                  <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl px-4">
                    Al Sistema de Control y Seguridad alimentaria para proteger la salud de nuestra ciudad
                  </p>
                </div>
              </header>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          aria-label="Previous slide"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <ChevronLeft className="w-6 h-6 text-white" />
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          aria-label="Next slide"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
            <ChevronRight className="w-6 h-6 text-white" />
            <span className="sr-only">Next</span>
          </span>
        </button>

        <div className="absolute z-30 flex gap-3 -translate-x-1/2 bottom-5 left-1/2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-orange-500 w-8" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-current={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </LoaderContent>
  )
}

export default Header
