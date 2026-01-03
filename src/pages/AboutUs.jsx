import React, { useEffect, useRef, useState } from "react";

const AboutUs = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();

      // Adjust this value: lower = slower, higher = faster
      const scrollAmount = e.deltaY * 0.5;
      container.scrollLeft += scrollAmount;
    };

    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const scrollPercentage =
        maxScroll > 0 ? container.scrollLeft / maxScroll : 0;
      setScrollProgress(scrollPercentage);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ========================================
  // ADD NEW SECTIONS HERE - Works dynamically for any number!
  // ========================================
  const sections = [
    {
      id: 1,
      type: "text",
      lines: [
        { text: "WE ARE FIBI SPACE", italic: false },
        { text: "A CREATIVE", italic: false },
        { text: "PRODUCTION STUDIO", italic: true },
      ],
      bottomRight: {
        text: "NICE TO",
        italic: true,
        text2: "MEET YOU",
        italic2: false,
      },
    },
    {
      id: 2,
      type: "text",
      lines: [
        { text: "The team of experienced", italic: false },
        { text: "and skilled", italic: false },
        { text: "professionals", italic: false },
      ],
      bottomRight: {
        text: "who bring a wide range of",
        italic: true,
        text2: "talents and perspectives",
        italic2: false,
        text3: "to a project.",
        italic3: false,
      },
    },
    {
      id: 3,
      type: "image-text",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
      title: "Our Creative Process",
      description:
        "We believe in a collaborative approach that brings together diverse perspectives and expertise. Our team works closely with clients to understand their vision and transform it into compelling digital experiences that resonate with audiences.",
    },
    {
      id: 4,
      type: "image-text",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
      title: "Our Creative Process",
      description:
        "We believe in a collaborative approach that brings together diverse perspectives and expertise. Our team works closely with clients to understand their vision and transform it into compelling digital experiences that resonate with audiences.",
    },
    // ADD MORE SECTIONS HERE - Just keep adding!
    // {
    //   id: 4,
    //   type: 'text',
    //   lines: [
    //     { text: "ANOTHER SECTION", italic: false },
    //   ],
    //   bottomRight: {
    //     text: "MORE TEXT",
    //     italic: false
    //   }
    // },
  ];
  // ========================================

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="relative flex h-screen overflow-x-auto overflow-y-hidden z-10"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            index={index}
            scrollProgress={scrollProgress}
            totalSections={sections.length}
          />
        ))}
      </div>

      {/* Plus Signs - Static */}
      <div className="fixed top-12 left-12 text-black/30 text-2xl md:text-4xl pointer-events-none z-20">
        +
      </div>
      <div className="fixed top-12 left-[30%] text-black/30 text-2xl md:text-4xl pointer-events-none z-20">
        +
      </div>
      <div className="fixed top-12 left-[50%] text-black/30 text-2xl md:text-4xl pointer-events-none z-20">
        +
      </div>
      <div className="fixed top-12 left-[70%] text-black/30 text-2xl md:text-4xl pointer-events-none z-20">
        +
      </div>
      <div className="fixed top-12 right-12 text-black/30 text-2xl md:text-4xl pointer-events-none z-20">
        +
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full overflow-hidden z-20">
        <div
          className="h-full bg-black rounded-full transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Debug - Remove later */}
      <div className="fixed top-20 right-12 text-black/70 text-xs z-20 bg-white/80 px-3 py-1 rounded">
        Scroll: {(scrollProgress * 100).toFixed(1)}%
      </div>
    </div>
  );
};

// Individual Section Component
const Section = ({ section, index, scrollProgress, totalSections }) => {
  // DYNAMIC CALCULATION FOR ANY NUMBER OF SECTIONS
  // With 50% overlap: unit = 1 / (N + 1)
  // Section i appears at: i * unit
  // Section i centered at: (i + 1) * unit
  // Section i exits at: (i + 2) * unit

  const unit = 1 / (totalSections + 3);
  const sectionStart = index * unit;
  const sectionMidpoint = (index + 1) * unit;
  const sectionEnd = (index + 2) * unit;

  let translateX = 0;
  let scale = 0.85;
  let visibility = "hidden"; // hidden, visible

  // FIRST SECTION - Starts fully visible
  if (index === 0) {
    if (scrollProgress < sectionMidpoint) {
      // Fully visible from start
      translateX = 0;
      scale = 1;
      visibility = "visible";
    } else if (
      scrollProgress >= sectionMidpoint &&
      scrollProgress < sectionEnd
    ) {
      // Exiting to left
      const progress =
        (scrollProgress - sectionMidpoint) / (sectionEnd - sectionMidpoint);
      translateX = -progress * 100;
      scale = 1 - progress * 0.15;
      visibility = "visible";
    } else {
      // Fully exited
      translateX = -100;
      scale = 0.85;
      visibility = "hidden";
    }
  }
  // MIDDLE & LAST SECTIONS
  else {
    if (scrollProgress < sectionStart) {
      // Not yet visible
      translateX = 100;
      scale = 0.85;
      visibility = "hidden";
    } else if (
      scrollProgress >= sectionStart &&
      scrollProgress < sectionMidpoint
    ) {
      // Entering from right
      const progress =
        (scrollProgress - sectionStart) / (sectionMidpoint - sectionStart);
      translateX = (1 - progress) * 100;
      scale = 0.85 + progress * 0.15;
      visibility = "visible";
    } else if (
      scrollProgress >= sectionMidpoint &&
      scrollProgress < sectionEnd
    ) {
      // Centered or exiting
      if (index === totalSections - 1) {
        // Last section stays centered
        translateX = 0;
        scale = 1;
        visibility = "visible";
      } else {
        // Exiting to left
        const progress =
          (scrollProgress - sectionMidpoint) / (sectionEnd - sectionMidpoint);
        translateX = -progress * 100;
        scale = 1 - progress * 0.15;
        visibility = "visible";
      }
    } else {
      // Fully exited (or last section still visible)
      if (index === totalSections - 1) {
        translateX = 0;
        scale = 1;
        visibility = "visible";
      } else {
        translateX = -100;
        scale = 0.85;
        visibility = "hidden";
      }
    }
  }

  // Render image-text layout
  if (section.type === "image-text") {
    return (
      <div
        className="relative min-w-full h-full flex-shrink-0 flex items-center justify-center p-12 md:p-16 lg:p-24"
        style={{ visibility }}
      >
        <div
          className="w-full max-w-7xl h-full border-4 border-black rounded-3xl overflow-hidden flex items-center bg-white"
          style={{
            transform: `translateX(${translateX}%) scale(${scale})`,
            transition: "none",
          }}
        >
          <div className="flex flex-col md:flex-row w-full h-full">
            {/* Left - Image */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right - Text */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] font-bold text-black mb-6 leading-tight">
                {section.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                {section.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default text layout
  return (
    <div
      className="relative min-w-full h-full flex-shrink-0 flex items-center justify-center p-12 md:p-16 lg:p-24"
      style={{ visibility }}
    >
      <div
        className="w-full max-w-7xl h-full border-4 border-black rounded-3xl flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 text-black bg-white"
        style={{
          transform: `translateX(${translateX}%) scale(${scale})`,
          transition: "none",
        }}
      >
        {/* Top Left Text */}
        <div className="max-w-4xl">
          {section.lines.map((line, idx) => (
            <h1
              key={idx}
              className={`text-[32px] sm:text-[48px] md:text-[72px] lg:text-[95px] leading-none mb-2 ${
                line.italic ? "italic font-light" : "font-normal"
              }`}
            >
              {line.text}
            </h1>
          ))}
        </div>

        {/* Bottom Right Text */}
        <div className="self-end text-right max-w-2xl">
          <h2
            className={`text-[24px] sm:text-[32px] md:text-[48px] lg:text-[64px] leading-tight ${
              section.bottomRight.italic ? "italic font-light" : "font-normal"
            }`}
          >
            {section.bottomRight.text}
          </h2>
          {section.bottomRight.text2 && (
            <h2
              className={`text-[24px] sm:text-[32px] md:text-[48px] lg:text-[64px] leading-tight ${
                section.bottomRight.italic2
                  ? "italic font-light"
                  : "font-normal"
              }`}
            >
              {section.bottomRight.text2}
            </h2>
          )}
          {section.bottomRight.text3 && (
            <h2
              className={`text-[24px] sm:text-[32px] md:text-[48px] lg:text-[64px] leading-tight ${
                section.bottomRight.italic3
                  ? "italic font-light"
                  : "font-normal"
              }`}
            >
              {section.bottomRight.text3}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
