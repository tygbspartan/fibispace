import React from "react";

const AboutHero: React.FC = () => {
  return (
    <section className="bg-white pt-8 md:pt-12 lg:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 lg:mb-12">
          {/* Left Side - Text Content (Vertically Centered) */}
          <div className="flex flex-col justify-center">
            <p
              className="text-[#008AA9] mb-3 md:mb-4"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: "500",
                lineHeight: "clamp(40px, 6vw, 64px)",
                letterSpacing: "0%",
              }}
            >
              About Us
            </p>

            <h1
              className="mb-4 md:mb-6"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: "500",
                lineHeight: "clamp(40px, 6vw, 64px)",
                letterSpacing: "0%",
              }}
            >
              Your Partner in Digital Success
            </h1>

            <p
              className="text-gray-700"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(16px, 2.5vw, 24px)",
                fontWeight: "300",
                lineHeight: "clamp(24px, 4vw, 40px)",
                letterSpacing: "0%",
              }}
            >
              At Fibi Space, we connect you with your ideal customers through
              innovative digital strategies. We don't just execute campaigns; we
              understand your business needs and craft a roadmap to help you
              beat your competitors. From SEO to Paid Ads to Branding to Content
              Creation to Web Design, our expert team integrates every digital
              avenue to build your presence. We start by listening to your
              goals, then do whatever it takes to ensure your brand reaches new
              heights.
            </p>
          </div>

          {/* Right Side - Hero Image (Taller, Sticks Right) */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src="/images/about-hero.jpg"
              alt="About Us Hero"
              className="rounded w-full lg:w-auto lg:ml-auto"
              style={{
                maxWidth: "700px",
                height: "auto",
                minHeight: "400px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
