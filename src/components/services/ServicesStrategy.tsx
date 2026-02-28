import React from "react";

const ServicesStrategy: React.FC = () => {
  return (
    <section className="bg-white pt-12 md:pt-16 lg:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-8xl mx-auto text-center">
          <p className="text-xl md:text-2xl lg:text-4xl font-light leading-relaxed md:leading-relaxed lg:leading-relaxed">
            <span className="text-[#008AA9] font-medium">
              A Strategy as Unique as Your Business.
            </span>{" "}
            We don't do templates. We build custom strategies that bridge the
            gap between your brand and your ideal customers. From creative
            branding to technical execution, we handle the digital heavy lifting
            so you can focus on winning.
          </p>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black mt-8 md:mt-12 lg:mt-16"></div>
      </div>
    </section>
  );
};

export default ServicesStrategy;
