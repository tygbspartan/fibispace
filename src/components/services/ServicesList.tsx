import React, { useState, useEffect, useRef } from "react";
import contentData from "../../data/content.json";
import { useNavigate } from "react-router-dom";

const ServicesList: React.FC = () => {
  const navigate = useNavigate() 
  const { services } = contentData;
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer for animations
  useEffect(() => {

    if (services.length === 0) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setAnimatedCards((prev) => new Set(prev).add(index));
              }, index * 100); // 0.2s stagger between cards
            }
          });
        },
        {
          threshold: 0.1, // Trigger when 20% visible
        },
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [services.length]);

  return (
    <section className="bg-white py-12 md:py-20 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Title */}
        <h2
          className="mb-10 md:mb-12 lg:mb-16"
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: "500",
            lineHeight: "clamp(40px, 6vw, 64px)",
          }}
        >
          Our Services
        </h2>

        {/* Services List */}
        <div className="space-y-6 md:space-y-8">
          {services.map((service, index) => {
            const isAnimated = animatedCards.has(index);

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`p-6 md:p-8 lg:p-12 rounded-lg relative overflow-hidden transition-all duration-1000 ease-out ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0"
                }`}
                style={{
                  backgroundColor: service["bg-color"],
                  transform: !isAnimated ? "translateY(50px)" : "translateY(0)",
                }}
              >
                <div className="flex items-start md:items-center gap-4 md:gap-8 lg:gap-12">
                  {/* Large Number - Left Side - Responsive */}
                  <div
                    className="flex-shrink-0"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "clamp(64px, 10vw, 128px)",
                      fontWeight: "400",
                      lineHeight: "1",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#FFFFFF",
                      textTransform: "capitalize",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Content - Right Side */}
                  <div className="flex-1">
                    {/* Title - Responsive */}
                    <h3
                      className="mb-3 md:mb-4 capitalize"
                      style={{
                        fontFamily: "Inter",
                        fontSize: "clamp(20px, 3.5vw, 36px)",
                        fontWeight: "300",
                        lineHeight: "clamp(28px, 4.5vw, 50px)",
                        letterSpacing: "0%",
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Description - Responsive */}
                    <p
                      className="text-gray-600 mb-4 md:mb-6 capitalize"
                      style={{
                        fontFamily: "Inter",
                        fontSize: "clamp(14px, 2vw, 20px)",
                        fontWeight: "300",
                        lineHeight: "clamp(22px, 3vw, 30px)",
                        letterSpacing: "0%",
                      }}
                    >
                      {service.description}
                    </p>

                    {/* Discuss Project Button - Responsive */}
                    <button
                      className="px-4 md:px-5 py-1 md:py-1.5 border border-black rounded capitalize hover:bg-black hover:text-white transition-colors"
                      style={{
                        fontFamily: "Inter",
                        fontSize: "clamp(14px, 2vw, 20px)",
                        fontWeight: "300",
                        lineHeight: "clamp(22px, 3vw, 30px)",
                        letterSpacing: "0%",
                        textAlign: "center",
                      }}
                      onClick={()=>{
                        navigate('/contact')
                      }}
                    >
                      Discuss Project
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
