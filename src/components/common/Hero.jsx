import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import banner from "../../assets/banner.jpg";
import banner2 from "../../assets/banner2.jpg";
import banner3 from "../../assets/banner3.jpg";
import govtLogo from "../../assets/govt.png";
import court1 from "../../assets/court.jpg";
import court2 from "../../assets/court2.jpg";
import court4 from "../../assets/court4.jpg";
import court5 from "../../assets/court5.jpg";
import logo from "../../assets/bg-image.jpg";
import ScaleLottie from "../lottie/ScaleLottie";
const bannerSlides = [
  {
    id: 1,
    image: banner,
  },
  {
    id: 2,
    image: court1,
  },
  {
    id: 3,
    image: court4,
  },
  {
    id: 4,
    image: court5,
  },
];

const Hero = () => {
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
    <div className="relative w-full h-44 md:h-56 lg:h-64 overflow-hidden">
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
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 px-4 text-white text-center">
            <h1 className="font-bold text-xl md:text-2xl lg:text-4xl">
              {t("title")}
            </h1>
            <h2 className="text-sm lg:text-xl">{t("haeding")}</h2>
          </div>

          {/* logo */}
          <div className="top-5 z-50 absolute mx-auto w-full">
            <div className="flex justify-between mx-auto w-11/12">
              <img
                className="shadow-md w-10 md:w-15 h-10 md:h-15"
                src={govtLogo}
                alt="govt logo"
              />
              {/* <ScaleLottie /> */}
              <img
                className="shadow-md rounded-full w-10 md:w-15 h-10 md:h-15"
                src={logo}
                alt="Mamla logo "
              />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      {/* <div className="top-1/2 absolute flex justify-between items-center px-4 w-full -translate-y-1/2 transform">
        <button onClick={prevSlide} className="bg-gray-100/60 btn btn-circle">
          ❮
        </button>
        <button onClick={nextSlide} className="bg-gray-100/60 btn btn-circle">
          ❯
        </button>
      </div> */}
    </div>
  );
};

export default Hero;
