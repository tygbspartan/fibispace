import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const AboutSection = ({
  titleTop,
  titleBottom,
  description,
  imagePath,
  buttonRequired,
  leftStick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-10 px-4 md:px-0">
      <div>
        {/* Heading with Roll Animation */}
        <div className="overflow-hidden mb-8 md:mb-12 flex flex-col">
          <span
            className={`text-[32px] sm:text-[48px] md:text-[72px] lg:text-[95px] pl-0 sm:${leftStick? 'pl-0' : 'pl-[10vw]'} md:${leftStick? 'pl-0' : 'pl-[20vw]'} font-normal leading-tight`}
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {titleTop}
          </span>
          <span
            className="text-[32px] sm:text-[48px] md:text-[72px] lg:text-[95px] font-normal leading-tight"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {titleBottom}
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-center">
          {/* Left - Image */}
          <div
            style={{
              transform: isVisible ? "translateX(0)" : "translateX(-80px)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
            }}
          >
            <div className="rounded-2xl overflow-hidden">
              <img
                src={imagePath}
                alt="Team collaboration"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Right - Description & Button */}
          <div
            className="md:pl-12 lg:pl-24"
            style={{
              transform: isVisible ? "translateX(0)" : "translateX(80px)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
            }}
          >
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-6 md:mb-8">
              {description}
            </p>

            {/* About Us Button */}
            {buttonRequired && (
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white rounded-full text-black hover:px-7 sm:hover:px-8 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <span className="text-lg sm:text-xl font-extrabold transition-all duration-300 group-hover:opacity-0 group-hover:scale-0">
                  •
                </span>
                <span className="text-lg sm:text-xl absolute opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  →
                </span>
                <span className="relative text-sm sm:text-base font-medium transition-transform duration-300 group-hover:translate-x-1">
                  ABOUT US
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;