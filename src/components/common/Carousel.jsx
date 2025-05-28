import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import banner from "../../assets/banner.jpg"
import banner2 from "../../assets/banner2.jpg"
import banner3 from "../../assets/banner3.jpg"

const bannerSlides = [
  {
    id: 1,
    image: banner,
  },
  {
    id: 2,
    image: banner2,
  },
  {
    id: 3,
    image: banner3,
  },
];

const Carousel = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === bannerSlides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bannerSlides.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === bannerSlides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-44 md:h-64 lg:h-[250px] overflow-hidden">
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute transition-opacity duration-700 ease-in-out w-full h-full ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${slide.id}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="font-bold text-xl md:text-2xl lg:text-4xl">
              {t("title")}
            </h1>
            <h2 className="text-sm lg:text-xl">{t("haeding")}</h2>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      {/* <div className="absolute flex justify-between items-center w-full px-4 top-1/2 transform -translate-y-1/2">
        <button onClick={prevSlide} className="btn btn-circle bg-white/60">
          ❮
        </button>
        <button onClick={nextSlide} className="btn btn-circle bg-white/60">
          ❯
        </button>
      </div> */}
    </div>
  );
};

export default Carousel;
