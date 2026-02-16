import React from "react";

const AboutProcess: React.FC = () => {
  const steps = [
    {
      icon: "/images/process/visibility.png",
      number: "01",
      title: "Visibility:",
      description:
        "We amplify your brand presence across all social media platforms.",
    },
    {
      icon: "/images/process/traffic.png",
      number: "02",
      title: "Traffic:",
      description:
        "We drive high-intent users from social feeds to your website.",
    },
    {
      icon: "/images/process/inquiries.png",
      number: "03",
      title: "Inquiries:",
      description:
        "We convert that traffic into calls, messages, and tangible leads.",
    },
    {
      icon: "/images/process/conversion.png",
      number: "04",
      title: "Conversion:",
      description: "We nurture those leads until they become loyal customers.",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Title */}
        <h2
          className="mb-10 md:mb-12 lg:mb-16"
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: "500",
            lineHeight: "clamp(40px, 6vw, 64px)",
            letterSpacing: "0%",
          }}
        >
          From Visibility to Conversion: How We Work
        </h2>

        {/* Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 md:p-8 rounded-lg relative"
              style={{
                backgroundColor: "#F9F1E4",
              }}
            >
              {/* Top Section: Icon and Number */}
              <div className="flex justify-between items-start mb-6 md:mb-8">
                {/* Icon - Left */}
                <div className="w-12 h-12 md:w-16 md:h-16">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Number - Right */}
                <span
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(64px, 10vw, 96px)",
                    fontWeight: "500",
                    lineHeight: "clamp(50px, 8vw, 70px)",
                    letterSpacing: "0%",
                    textAlign: "right",
                    color: "#FFFFFF",
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h4
                className="mb-2 md:mb-3"
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(24px, 4vw, 36px)",
                  fontWeight: "500",
                  lineHeight: "clamp(32px, 6vw, 70px)",
                  letterSpacing: "0%",
                }}
              >
                {step.title}
              </h4>

              {/* Description */}
              <p
                className="mb-10 md:mb-20"
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(16px, 2.5vw, 36px)",
                  fontWeight: "300",
                  lineHeight: "clamp(24px, 4vw, 70px)",
                  letterSpacing: "0%",
                }}
              >
                {step.description}
              </p>

              {/* Logo - Bottom Right */}
              <img
                src="/assets/fibiWhite.png"
                alt="Fibi Space Logo"
                className="absolute bottom-6 md:bottom-8 right-6 md:right-8 opacity-50"
                style={{
                  width: "53px",
                  height: "53px",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutProcess;
