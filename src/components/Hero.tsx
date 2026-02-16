import React from "react";
import contentData from "../data/content.json";

const Hero: React.FC = () => {
  const { hero } = contentData;

  const handleFreeCounselling = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white pt-8 md:pt-12 lg:pt-20 overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Hero Content */}
        <div className="text-center mb-8 md:mb-12">
          {/* Main Titles - Responsive */}
          <h1
            className="mb-4"
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: "clamp(28px, 5vw, 48px)",
              lineHeight: "clamp(36px, 6vw, 64px)",
              letterSpacing: "0%",
            }}
          >
            {hero.title}
            <br />
            {hero.subtitle}
          </h1>

          {/* Description - Responsive */}
          <p
            className="mb-6 md:mb-8 max-w-5xl mx-auto px-2"
            style={{
              fontFamily: "Inter",
              fontWeight: "400",
              fontSize: "clamp(16px, 2.5vw, 24px)",
              lineHeight: "clamp(20px, 3vw, 32px)",
              letterSpacing: "0%",
            }}
          >
            {hero.description}
          </p>

          {/* Free Counselling Button - Responsive */}
          <button
            onClick={handleFreeCounselling}
            className="px-6 md:px-8 py-3 bg-[#008AA9] text-white rounded-md hover:bg-[#007a98] transition-colors"
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            {hero.ctaText}
          </button>
        </div>

        {/* Phone Mockup with Floating Elements - Desktop Only (lg and above) */}
        <div className="relative hidden lg:flex justify-center items-center mt-16">
          {/* Phone Mockup */}
          <div className="relative z-10">
            <img
              src="/images/banner.png"
              alt="Phone Mockup"
              className="w-auto h-[45vh] object-contain"
            />
          </div>

          {/* Face Serum - Top Left */}
          <div
            className="absolute bg-white rounded-2xl shadow-xl p-4 transition-all"
            style={{
              top: "-45%",
              left: "5%",
              width: "clamp(160px, 12vw, 200px)",
            }}
          >
            <img
              src="/images/daily.png"
              alt="Face Serum"
              className="w-full h-full object-contain mb-2"
            />
            <p className="text-xs md:text-sm font-medium">Face Serum</p>
            <p className="text-xs md:text-sm text-gray-600">Rs. 985</p>
          </div>

          {/* Base Camp Cap - Right Side */}
          <div
            className="absolute z-50 bg-white rounded-2xl shadow-xl p-3 md:p-4 flex items-center gap-2 md:gap-3 transition-all"
            style={{
              top: "40%",
              right: "15%",
              width: "clamp(220px, 18vw, 280px)",
            }}
          >
            <img
              src="/images/cap.png"
              alt="Base Camp Cap"
              className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div>
              <p className="text-xs md:text-sm font-medium">Base Camp Cap</p>
              <p className="text-xs md:text-sm text-gray-600">Rs. 850</p>
            </div>
          </div>

          {/* Yellow Stat Box - Top Right */}
          <div
            className="absolute rounded-2xl shadow-xl p-4 md:p-6 flex items-center gap-3 md:gap-4 transition-all"
            style={{
              backgroundColor: "#FFD94E",
              top: "0",
              right: "5%",
              width: "clamp(260px, 20vw, 320px)",
            }}
          >
            <div className="text-2xl md:text-4xl">⏱️</div>
            <div>
              <p className="text-xl md:text-3xl font-bold">{hero.stats.time}</p>
              <p className="text-xs md:text-sm">{hero.stats.timeDescription}</p>
            </div>
          </div>

          {/* Orange Stat Box - Left Side */}
          <div
            className="absolute rounded-2xl shadow-xl p-4 md:p-6 transition-all"
            style={{
              backgroundColor: "#FE8159",
              top: "45%",
              left: "2%",
              width: "clamp(180px, 14vw, 220px)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xl md:text-2xl text-black">🌐</div>
            </div>
            <p className="text-xl md:text-3xl font-bold text-black">
              {hero.stats.reach}
            </p>
            <p className="text-xs md:text-sm text-black">
              {hero.stats.reachDescription}
            </p>
          </div>
        </div>

        {/* Tablet and Mobile View - Only Phone Mockup (hidden on desktop) */}
        <div className="lg:hidden flex justify-center items-center mt-8">
          <img
            src="/images/banner.png"
            alt="Phone Mockup"
            className="w-full max-w-sm md:max-w-md h-auto object-contain"
          />
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black"></div>
      </div>
    </section>
  );
};

export default Hero;
