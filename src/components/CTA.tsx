import React from "react";
import contentData from "../data/content.json";

const CTA: React.FC = () => {
  const { cta } = contentData;

  const handleQuickConnect = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#008AA9] min-h-screen flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 text-center py-12">
        {/* Small Title - Uppercase - Responsive */}
        <p
          className="text-white uppercase mb-6 md:mb-8 lg:mb-12"
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "clamp(18px, 4vw, 28px)",
            lineHeight: "clamp(30px, 5vw, 50px)",
            letterSpacing: "0%",
          }}
        >
          {cta.title}
        </p>

        {/* Main Heading - Split into two lines - Responsive */}
        <h2
          className="text-white mb-8 md:mb-12 lg:mb-16"
          style={{
            fontFamily: "Inter",
            fontWeight: "400",
            fontSize: "clamp(48px, 12vw, 150px)",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Let's Work
          <br />
          Together!
        </h2>

        {/* Quick Connect Button - Responsive */}
        <button
          onClick={handleQuickConnect}
          className="px-6 md:px-8 lg:px-10 py-3 md:py-4 bg-white text-[#008AA9] rounded-md hover:bg-gray-100 transition-colors shadow-lg"
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "clamp(16px, 2vw, 20px)",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          Quick Connect
        </button>
      </div>
    </section>
  );
};

export default CTA;
