import React from "react";

const ServicesHero: React.FC = () => {
  return (
    <section className="bg-white pt-8 md:pt-12 lg:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left Side - Text Content (Vertically Centered) */}
          <div className="flex flex-col justify-center">
            <p
              className="text-[#008AA9]"
              style={{
                fontFamily: "Inter",
                fontSize: "24px",
                fontWeight: "500",
                // lineHeight: "64px",
                letterSpacing: "0%",
              }}
            >
              Services
            </p>

            <h1
              style={{
                fontFamily: "Inter",
                fontSize: "48px",
                fontWeight: "500",
                lineHeight: "64px",
                letterSpacing: "0%",
              }}
            >
              Collaborating for Your
            </h1>
            <h1
              className="mb-6"
              style={{
                fontFamily: "Inter",
                fontSize: "48px",
                fontWeight: "500",
                lineHeight: "64px",
                letterSpacing: "0%",
              }}
            >
              Future
            </h1>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: "24px",
                fontWeight: "300",
                lineHeight: "40px",
                letterSpacing: "0%",
              }}
            >
              <span
                style={{
                  fontWeight: "500",
                }}
              >
                Design. Develop. Dominate.
              </span>{" "}
              We bridge the gap between creative vision and technical execution.
              Fibi Space offers a full spectrum of digital services designed to
              integrate seamlessly with your business goals. By combining
              top-tier Research, SEO, Branding, and Web Design, we turn your
              digital presence into your most powerful asset. Let's build
              something extraordinary together.
            </p>
          </div>

          {/* Right Side - Hero Image (Taller, Sticks Right) */}
          <div className="relative flex justify-end">
            <img
              src="/images/services-hero.jpg"
              alt="Services Hero"
              className="rounded ml-auto"
              style={{
                width: "700px",
                height: "auto",
                minHeight: "600px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
