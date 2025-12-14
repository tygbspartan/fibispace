import React, { useEffect, useRef, useState } from "react";

const ServiceCard = ({ service, index, scrollDirection }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              setHasAnimated(true);
            }, index * 150);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index, scrollDirection, hasAnimated]);

  return (
    <div
      ref={cardRef}
      className={`service-card-wrapper ${isVisible ? "visible" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full p-8 border border-gray-100">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="wave-animation absolute inset-0"></div>
        </div>

        <div className="relative z-10">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
            style={{
              background: "linear-gradient(135deg, #12a89d 0%, #0d8579 100%)",
            }}
          >
            <span className="text-2xl font-bold text-white">{service.id}</span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-300 group-hover:text-[#12a89d]">
            {service.title}
          </h3>

          <p className="text-gray-600 leading-relaxed">{service.description}</p>

          <div
            className="mt-6 h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"
            style={{
              background: "linear-gradient(90deg, #12a89d 0%, #0d8579 100%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
