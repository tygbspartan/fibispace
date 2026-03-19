import React, { useState, useEffect, useRef } from "react";
import contentData from "../../data/content.json";
import { useNavigate } from "react-router-dom";

const ServicesList: React.FC = () => {
  const navigate = useNavigate();
  const { services } = contentData;
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
              }, index * 100);
            }
          });
        },
        { threshold: 0.1 },
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

        <div className="space-y-6 md:space-y-8">
          {services.map((service, index) => {
            const isAnimated = animatedCards.has(index);
            const isExpanded = expandedCards.has(service.id);

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
                  {/* Number */}
                  <div
                    className="flex-shrink-0"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "clamp(64px, 10vw, 128px)",
                      fontWeight: "400",
                      lineHeight: "1",
                      color: "#FFFFFF",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <div className={`flex-1  ${index == 0 ? 'ml-[2vw]' : ''}`}>
                    {/* Title */}
                    <h3
                      className={`mb-3 md:mb-4 capitalize`}
                      style={{
                        fontFamily: "Inter",
                        fontSize: "clamp(20px, 3.5vw, 36px)",
                        fontWeight: "300",
                        lineHeight: "clamp(28px, 4.5vw, 50px)",
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Description — always visible on sm+, expandable on mobile */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out sm:!max-h-none sm:!opacity-100 ${
                        isExpanded
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0 sm:max-h-none sm:opacity-100"
                      }`}
                    >
                      <p
                        className="text-gray-600 mb-4 md:mb-6 capitalize"
                        style={{
                          fontFamily: "Inter",
                          fontSize: "clamp(14px, 2vw, 20px)",
                          fontWeight: "300",
                          lineHeight: "clamp(22px, 3vw, 30px)",
                        }}
                      >
                        {service.description}
                      </p>

                      {/* Discuss Project — visible inside expanded on mobile, always on sm+ */}
                      <button
                        className="px-4 md:px-5 py-1 md:py-1.5 border border-black rounded capitalize hover:bg-black hover:text-white transition-colors"
                        style={{
                          fontFamily: "Inter",
                          fontSize: "clamp(14px, 2vw, 20px)",
                          fontWeight: "300",
                          lineHeight: "clamp(22px, 3vw, 30px)",
                        }}
                        onClick={() =>
                          navigate("/contact", {
                            state: { service: service.title, index },
                          })
                        }
                      >
                        Discuss Project
                      </button>
                    </div>

                    {/* Learn More toggle — mobile only */}
                    <button
                      className="sm:hidden mt-3 underline capitalize text-sm font-light hover:opacity-70 transition-opacity"
                      style={{ fontFamily: "Inter" }}
                      onClick={() => toggleExpand(service.id)}
                    >
                      {isExpanded ? "Show Less" : "Learn More"}
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
