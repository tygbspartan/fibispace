import React, { useState, useEffect, useRef } from "react";
import contentData from "../data/content.json";

const Services: React.FC = () => {
  const { services } = contentData;
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFlip = (serviceId: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  // Intersection Observer for each card
  useEffect(() => {
    if (services.length === 0) return;

    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Stagger by column
              const columnDelay = (index % 4) * 150;
              setTimeout(() => {
                setAnimatedCards((prev) => new Set(prev).add(index));
              }, columnDelay);
            }
          });
        },
        {
          threshold: 0.2,
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
    <section className="bg-white pb-12 md:pb-20 overflow-hidden" id="services">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8 md:mb-10 lg:mb-16">
          Our Services
        </h2>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => {
            const isFlipped = flippedCards.has(service.id);
            const isAnimated = animatedCards.has(index);

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`relative transition-all duration-1000 ease-in-out ${
                  isAnimated ? "opacity-100 translate-y-0" : "opacity-0"
                }`}
                style={{
                  height: "clamp(450px, 60vw, 552px)",
                  perspective: "1000px",
                  transform: !isAnimated
                    ? "translateY(100px)"
                    : "translateY(0)",
                }}
              >
                {/* Card Container with Flip Animation */}
                <div
                  className="relative w-full h-full transition-transform duration-600"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transitionDuration: "0.6s",
                  }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute inset-0 rounded flex flex-col justify-between p-6 md:p-8"
                    style={{
                      backgroundColor: service["bg-color"] || "#F8F8F8",
                      borderRadius: "4px",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    {/* Card Content */}
                    <div className="flex flex-col flex-1">
                      {/* Service Title */}
                      <h3 className="font-light capitalize mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-snug">
                        {service.title}
                      </h3>

                      {/* Service Subtitle */}
                      <p className="font-light capitalize text-sm md:text-base lg:text-xl leading-relaxed">
                        {service.subtitle}
                      </p>
                    </div>

                    {/* Learn More Button - Bottom Left */}
                    <button
                      onClick={() => toggleFlip(service.id)}
                      className="text-left underline capitalize hover:opacity-80 transition-opacity text-sm md:text-base lg:text-xl"
                    >
                      Learn More
                    </button>
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 rounded flex flex-col justify-between p-6 md:p-8"
                    style={{
                      backgroundColor: service["bg-color"] || "#F8F8F8",
                      borderRadius: "4px",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Card Content */}
                    <div className="flex flex-col flex-1">
                      {/* Service Title */}
                      <h3 className="font-light capitalize mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-snug">
                        {service.title}
                      </h3>

                      {/* Service Description */}
                      <p className="font-light capitalize text-sm md:text-base lg:text-xl leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Go Back Button - Bottom Left */}
                    <button
                      onClick={() => toggleFlip(service.id)}
                      className="text-left underline capitalize hover:opacity-80 transition-opacity text-sm md:text-base lg:text-xl"
                    >
                      Go Back
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

export default Services;
