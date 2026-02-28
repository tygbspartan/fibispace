import React, { useEffect, useRef, useState } from "react";
import contentData from "../data/content.json";

const Expertise: React.FC = () => {
  const { expertise, expertiseDescription } = contentData;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Background colors for each card
  const cardBackgrounds = ["#F1F6FF", "#F9F1E4", "#F8F8F8"];

  // Split titles into two lines
  const splitTitle = (title: string) => {
    const words = title.split(" ");
    if (words.length >= 2) {
      return {
        firstLine: words[0],
        secondLine: words.slice(1).join(" "),
      };
    }
    return {
      firstLine: title,
      secondLine: "",
    };
  };

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  // Animation styles for each card
  const getCardAnimation = (index: number) => {
    if (!isVisible) {
      switch (index) {
        case 0:
          return {
            opacity: 0,
            transform: "translateX(-100px)",
          };
        case 1:
          return {
            opacity: 0,
            transform: "translateY(100px)",
          };
        case 2:
          return {
            opacity: 0,
            transform: "translateX(100px)",
          };
        default:
          return {};
      }
    }

    return {
      opacity: 1,
      transform: "translate(0, 0)",
      transition: `all 0.6s ease-out ${index * 0.2}s`,
    };
  };

  return (
    <section
      className="bg-white min-h-screen flex flex-col overflow-hidden"
      id="about"
      ref={sectionRef}
    >
      <div className="px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20 flex-1 flex flex-col">
        {/* Section Header - Title and Tagline */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 lg:gap-12 mb-8 md:mb-10 lg:mb-12">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium">
            Our Expertise
          </h2>

          {/* Tagline */}
          <div className="max-w-md lg:max-w-lg">
            <p className="text-base md:text-lg lg:text-2xl font-light leading-relaxed">
              Transform ideas into reality by combining
            </p>
            <p className="text-base md:text-lg lg:text-2xl font-light leading-relaxed">
              creativity, strategy, and expertise.
            </p>
          </div>
        </div>

        {/* Expertise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12 flex-1">
          {expertise.map((item, index) => {
            const { firstLine, secondLine } = splitTitle(item.title);

            return (
              <div
                key={item.id}
                className="rounded overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                style={{
                  backgroundColor: cardBackgrounds[index],
                  width: "100%",
                  maxWidth: "555px",
                  minHeight: "500px",
                  height: "auto",
                  borderRadius: "4px",
                  margin: "0 auto",
                  ...getCardAnimation(index),
                }}
              >
                {/* Card Content Section */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  {/* Title - Split into two lines */}
                  <h3 className="font-light capitalize mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl leading-tight md:leading-snug">
                    {firstLine}
                    {secondLine && (
                      <>
                        <br />
                        {secondLine}
                      </>
                    )}
                  </h3>

                  {/* Horizontal Line */}
                  <div className="w-full h-[1px] bg-black mb-3 md:mb-4"></div>

                  {/* Description */}
                  <p className="font-light text-[#5C5C5C] capitalize mb-2 text-sm md:text-base lg:text-xl leading-relaxed">
                    {item.description1}
                  </p>
                  <p className="font-light text-[#5C5C5C] capitalize text-sm md:text-base lg:text-xl leading-relaxed">
                    {item.description2}
                  </p>
                </div>

                {/* Card Image - At the bottom */}
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover transition-transform duration-300 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Description Box */}
        <div className="mt-auto mb-6 md:mb-8 lg:mb-10">
          <p className="text-center text-base md:text-lg lg:text-2xl leading-relaxed md:leading-loose">
            <span className="font-semibold">Be Where Your Customers Are: </span>
            <span className="font-light">{expertiseDescription}</span>
          </p>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black"></div>
      </div>
    </section>
  );
};

export default Expertise;
