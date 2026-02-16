import React from "react";

const AboutStats: React.FC = () => {
  const stats = [
    { number: "+8", label: "years", color: "#00981C" },
    { number: "+20", label: "clients", color: "#009FD1" },
    { number: "$9,000", label: "in ads", color: "#FFD94E" },
  ];

  return (
    <section className="bg-white pt-12 md:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left - Stats Circles */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-full border-8"
                style={{
                  borderColor: stat.color,
                  width: "clamp(150px, 20vw, 200px)",
                  height: "clamp(150px, 20vw, 200px)",
                }}
              >
                <p
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(32px, 5vw, 48px)",
                    fontWeight: "600",
                    lineHeight: "clamp(28px, 4vw, 35px)",
                    letterSpacing: "0%",
                    textAlign: "center",
                  }}
                >
                  {stat.number}
                </p>
                <p
                className="pt-2"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(16px, 2.5vw, 24px)",
                    fontWeight: "300",
                    lineHeight: "clamp(20px, 3vw, 35px)",
                    letterSpacing: "0%",
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Right - Commitment Text */}
          <div>
            <h2
              className="mb-4 md:mb-6"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: "500",
                lineHeight: "clamp(40px, 6vw, 64px)",
                letterSpacing: "0%",
              }}
            >
              Our Commitment to Excellence
            </h2>
            <p
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(16px, 2.5vw, 24px)",
                fontWeight: "300",
                lineHeight: "clamp(24px, 4vw, 40px)",
                letterSpacing: "0%",
              }}
            >
              Our goal is simple:{" "}
              <span
                style={{
                  fontWeight: "600",
                }}
              >
                constant innovation and maximum ROI.
              </span>{" "}
              We stay ahead of industry trends to unlock new opportunities for
              your audience. We never compromise on quality, taking full
              ownership of our work to ensure excellence. At Fibi Space, we
              believe in open communication and treating every partnership with
              the respect it deserves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
