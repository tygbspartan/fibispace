import React from "react";

const ProjectsHero: React.FC = () => {
  return (
    <section className="bg-white pt-8 md:pt-12 lg:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8 lg:mb-12">
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-between h-full">
            {/* Spacer to push content to center - Desktop Only */}
            <div className="hidden lg:block flex-1"></div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col justify-start lg:justify-center">
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
                Projects
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
                Our Signature Projects
              </h1>

              <p
                className="text-gray-600 mb-6 lg:mb-0"
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(16px, 2.5vw, 24px)",
                  fontWeight: "300",
                  lineHeight: "clamp(24px, 4vw, 40px)",
                  letterSpacing: "0%",
                }}
              >
                With years of hard work, here we highlight a curated collection
                of our most impactful collaborations. From the tiniest to the
                largest, our projects reflect a dedication to innovation,
                creativity, and result-driven working.
              </p>
            </div>

            {/* Bottom Right - Turning Vision Text - Desktop Only */}
            <div className="hidden lg:flex text-right flex-1 items-end justify-end">
              <p
                style={{
                  fontFamily: "Inter",
                  fontSize: "36px",
                  fontWeight: "500",
                  lineHeight: "68px",
                  letterSpacing: "0%",
                }}
              >
                <span className="text-[#C3C3C3]">Turning Vision Into </span>
                <span className="text-black">Visibility</span>
              </p>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src="/images/projects-hero.png"
              alt="Projects Hero"
              className="rounded w-[40vw] lg:ml-auto"
              style={{
                maxWidth: "717px",
                height: "auto",
                aspectRatio: "717/893",
                borderRadius: "4px",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Mobile/Tablet - Turning Vision Text (Below Image) */}
          <div className="lg:hidden text-center md:text-right col-span-1">
            <p
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(24px, 4vw, 36px)",
                fontWeight: "500",
                lineHeight: "clamp(32px, 5vw, 68px)",
                letterSpacing: "0%",
              }}
            >
              <span className="text-[#C3C3C3]">Turning Vision Into </span>
              <span className="text-black">Visibility</span>
            </p>
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-black mt-8 lg:mt-0"></div>
      </div>
    </section>
  );
};

export default ProjectsHero;
