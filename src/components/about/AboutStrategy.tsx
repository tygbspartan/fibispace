import React from "react";

const AboutStrategy: React.FC = () => {
  return (
    <section className="bg-white pt-12 md:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-8xl mx-auto text-center">
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(24px, 4vw, 36px)",
              lineHeight: "clamp(32px, 5vw, 52px)",
              letterSpacing: "0%",
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: "#008AA9",
                fontWeight: "500",
              }}
            >
              Your Vision. Our Strategy. Real Growth.
            </span>{" "}
            <span
              style={{
                color: "#000000",
                fontWeight: "500",
              }}
            >
              We connect you with your ideal customers by blending innovation
              with execution. From SEO to Branding,
            </span>{" "}
            <span
              style={{
                color: "#000000",
                fontWeight: "200",
              }}
            >
              our team crafts a custom roadmap based on your specific goals,
              ensuring you don't just compete, but win.
            </span>
          </p>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black mt-16"></div>
      </div>
    </section>
  );
};

export default AboutStrategy;
