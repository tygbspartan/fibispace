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
        threshold: 0.3, // Trigger when 30% of section is visible
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
      // Initial state before animation
      switch (index) {
        case 0: // Slide from left
          return {
            opacity: 0,
            transform: "translateX(-100px)",
          };
        case 1: // Slide from bottom
          return {
            opacity: 0,
            transform: "translateY(100px)",
          };
        case 2: // Slide from right
          return {
            opacity: 0,
            transform: "translateX(100px)",
          };
        default:
          return {};
      }
    }

    // Animated state
    return {
      opacity: 1,
      transform: "translate(0, 0)",
      transition: `all 0.6s ease-out ${index * 0.2}s`, // Staggered delay
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 lg:gap-12">
          {/* Title */}
          <h2
            className="text-[32px] md:text-[40px] lg:text-[48px] font-medium"
            style={{
              fontFamily: "Inter",
              lineHeight: "40px",
              letterSpacing: "0%",
            }}
          >
            Our Expertise
          </h2>

          {/* Tagline */}
          <div>
            <p
              className="text-[18px] md:text-[20px] lg:text-[24px] font-light max-w-md lg:max-w-lg"
              style={{
                fontFamily: "Inter",
                lineHeight: "32px",
                letterSpacing: "0%",
              }}
            >
              Transform ideas into reality by combining
            </p>
            <p
              className="text-[18px] md:text-[20px] lg:text-[24px] font-light max-w-md lg:max-w-lg"
              style={{
                fontFamily: "Inter",
                lineHeight: "32px",
                letterSpacing: "0%",
              }}
            >
              creativity, strategy, and expertise.
            </p>
          </div>
        </div>

        {/* Expertise Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 flex-1">
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
                  height: "572px",
                  borderRadius: "4px",
                  margin: "0 auto",
                  ...getCardAnimation(index), // Apply animation styles
                }}
              >
                {/* Card Content Section */}
                <div className="p-8 flex flex-col">
                  {/* Title - Split into two lines */}
                  <h3
                    className="font-light capitalize mb-4"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "36px",
                      lineHeight: "50px",
                      letterSpacing: "0%",
                    }}
                  >
                    {firstLine}
                    {secondLine && (
                      <>
                        <br />
                        {secondLine}
                      </>
                    )}
                  </h3>

                  {/* Horizontal Line */}
                  <div className="w-full h-[1px] bg-black mb-4"></div>

                  {/* Description */}
                  <p
                    className="font-light text-[#5C5C5C] capitalize"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "20px",
                      lineHeight: "30px",
                      letterSpacing: "0%",
                    }}
                  >
                    {item.description1}
                  </p>
                  <p
                    className="font-light text-[#5C5C5C] capitalize"
                    style={{
                      fontFamily: "Inter",
                      fontSize: "20px",
                      lineHeight: "30px",
                      letterSpacing: "0%",
                    }}
                  >
                    {item.description2}
                  </p>
                </div>

                {/* Card Image - At the bottom */}
                <div className="px-8">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                    onError={(e) => {
                      // e.currentTarget.src =
                      //   "https://via.placeholder.com/491x284?text=" +
                      //   item.title;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Description Box */}
        <div className="mt-auto mb-10">
          <p
            className="text-center"
            style={{
              fontFamily: "Inter",
              fontSize: "24px",
              lineHeight: "40px",
              letterSpacing: "0%",
            }}
          >
            <span className="font-semibold" style={{ fontWeight: "600" }}>
              Be Where Your Customers Are:{" "}
            </span>
            <span className="font-light" style={{ fontWeight: "300" }}>
              {expertiseDescription}
            </span>
          </p>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black"></div>
      </div>
    </section>
  );
};

export default Expertise;
