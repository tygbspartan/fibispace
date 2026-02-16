import React from "react";

const ServicesStrategy: React.FC = () => {
  return (
    <section className="bg-white pt-12 md:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-8xl mx-auto text-center">
          <p
            style={{
              fontFamily: "Inter",
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: "300",
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
              A Strategy as Unique as Your Business.
            </span>{" "}
            We don't do templates. We build custom strategies that bridge the
            gap between your brand and your ideal customers. From creative
            branding to technical execution, we handle the digital heavy lifting
            so you can focus on winning.
          </p>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black mt-12"></div>
      </div>
    </section>
  );
};

export default ServicesStrategy;
