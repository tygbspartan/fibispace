import React from "react";

const AboutStrategy: React.FC = () => {
  return (
    <section className="bg-white pt-12 md:pt-16 lg:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-8xl mx-auto text-center">
          <p className="text-xl md:text-2xl lg:text-4xl leading-relaxed md:leading-relaxed lg:leading-relaxed">
            <span className="text-[#008AA9] font-medium">
              Your Vision. Our Strategy. Real Growth.
            </span>{" "}
            <span className="text-black font-medium">
              We connect you with your ideal customers by blending innovation
              with execution. From SEO to Branding,
            </span>{" "}
            <span className="text-black font-extralight">
              our team crafts a custom roadmap based on your specific goals,
              ensuring you don't just compete, but win.
            </span>
          </p>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black mt-8 md:mt-12 lg:mt-16"></div>
      </div>
    </section>
  );
};

export default AboutStrategy;
