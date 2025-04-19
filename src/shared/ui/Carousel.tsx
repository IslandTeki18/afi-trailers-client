import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface CarouselProps {
  images: string[];
  interval?: number;
  variant?: "primary" | "secondary" | "success" | "danger";
}

const getVariantClasses = (variant: string) => {
  const baseClasses = "transition-colors duration-200";
  const variantClasses = {
    primary:
      "bg-blue-500 hover:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 text-white",
    secondary:
      "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white",
    success:
      "bg-green-500 hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-600 text-white",
    danger:
      "bg-red-500 hover:bg-red-400 dark:bg-red-700 dark:hover:bg-red-600 text-white",
  };
  // @ts-ignore
  return `${baseClasses} ${variantClasses[variant] || variantClasses.primary}`;
};

export const Carousel: React.FC<CarouselProps> = ({
  images,
  interval = 5000,
  variant = "primary",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-96 object-cover flex-shrink-0"
            />
          ))}
        </div>
        <button
          className={`absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full ${getVariantClasses(
            variant
          )}`}
          onClick={goToPrevious}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full ${getVariantClasses(
            variant
          )}`}
          onClick={goToNext}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex
                ? getVariantClasses(variant)
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
