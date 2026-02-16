import React from "react";

const AboutMissionVision: React.FC = () => {
  return (
    <section className="bg-white pt-12 md:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Our Mission */}
          <div
            className="p-8 md:p-10 lg:p-12 rounded-lg relative"
            style={{
              backgroundColor: "#009FD11A",
            }}
          >
            {/* Logo - Top Right */}
            <img
              src="/assets/fibiWhite.png"
              alt="Fibi Space Logo"
              className="absolute top-8 right-8 w-10 h-10 md:w-12 md:h-12 opacity-50"
            />

            {/* Title */}
            <h3
              className="mb-6 md:mb-8 capitalize"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: "200",
                lineHeight: "clamp(50px, 8vw, 90px)",
                letterSpacing: "0%",
              }}
            >
              Our
              <br />
              Mission
            </h3>

            {/* Description */}
            <p
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(16px, 2.5vw, 24px)",
                fontWeight: "300",
                lineHeight: "clamp(24px, 4vw, 40px)",
                letterSpacing: "0%",
              }}
            >
              To drive business growth by breaking down the barriers between
              Above the Line and Below the Line marketing. We are dedicated to
              crafting high-impact strategies that turn brand vision into
              reality, ensuring our clients dominate both the screen and the
              street.
            </p>
          </div>

          {/* Our Vision */}
          <div
            className="p-8 md:p-10 lg:p-12 rounded-lg relative"
            style={{
              backgroundColor: "#009FD11A",
            }}
          >
            {/* Logo - Top Right */}
            <img
              src="/assets/fibiWhite.png"
              alt="Fibi Space Logo"
              className="absolute top-8 right-8 w-10 h-10 md:w-12 md:h-12 opacity-50"
            />

            {/* Title */}
            <h3
              className="mb-6 md:mb-8 capitalize"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: "200",
                lineHeight: "clamp(50px, 8vw, 90px)",
                letterSpacing: "0%",
              }}
            >
              Our
              <br />
              Vision
            </h3>

            {/* Description */}
            <p
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(16px, 2.5vw, 24px)",
                fontWeight: "300",
                lineHeight: "clamp(24px, 4vw, 40px)",
                letterSpacing: "0%",
              }}
            >
              To be the most trusted growth partner for brands in Nepal and
              beyond, setting the standard for integrated marketing by
              seamlessly blending technology, creativity, and human connection.
            </p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-black mt-12"></div>
      </div>
    </section>
  );
};

export default AboutMissionVision;
