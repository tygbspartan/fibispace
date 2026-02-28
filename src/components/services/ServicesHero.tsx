import React from "react";

const ServicesHero: React.FC = () => {
  return (
    <section className="bg-white pt-8 md:pt-12 lg:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 lg:mb-12">
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center">
            <p className="text-[#008AA9] mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl font-medium">
              Services
            </p>

            <h1 className="mb-4 md:mb-6 text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
              Collaborating for Your Future
            </h1>

            <p className="text-gray-700 text-base md:text-lg lg:text-2xl font-light leading-relaxed">
              <span className="font-medium">Design. Develop. Dominate.</span> We
              bridge the gap between creative vision and technical execution.
              Fibi Space offers a full spectrum of digital services designed to
              integrate seamlessly with your business goals. By combining
              top-tier Research, SEO, Branding, and Web Design, we turn your
              digital presence into your most powerful asset. Let's build
              something extraordinary together.
            </p>
          </div>

          {/* Right Side - Hero Image (Uncomment when image is ready) */}
          {/* <div className="relative flex justify-center lg:justify-end">
            <img
              src="/images/services-hero.jpg"
              alt="Services Hero"
              className="rounded w-full lg:w-auto lg:ml-auto"
              style={{
                maxWidth: "700px",
                height: "auto",
                objectFit: "cover",
              }}
            />
          </div> */}
        </div>

        {/* Horizontal Line */}
        {/* <div className="w-full h-[1px] bg-black"></div> */}
      </div>
    </section>
  );
};

export default ServicesHero;
