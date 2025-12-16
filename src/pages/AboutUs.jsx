import React, { useState, useEffect } from "react";

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState([]);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Letter-by-letter animation for title - Start after delay
  useEffect(() => {
    // Wait 500ms before starting the animation
    const startDelay = setTimeout(() => {
      setAnimationStarted(true);
      const title = "About Us";
      const letters = title.split("");

      letters.forEach((letter, index) => {
        setTimeout(() => {
          setVisibleLetters((prev) => [...prev, { letter, index }]);
        }, index * 100);
      });
    }, 1500);

    return () => clearTimeout(startDelay);
  }, []);

  // Calculate path reveal based on scroll
  const totalHeight =
    typeof document !== "undefined"
      ? document.documentElement.scrollHeight
      : 3000;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 800;
  const scrollableHeight = totalHeight - viewportHeight;
  const scrollProgress = Math.min(scrollY / scrollableHeight, 1);

  const futureGoals = [
    {
      title: "Expand Global Reach",
      description:
        "Establish partnerships across continents to serve clients worldwide with localized digital marketing expertise.",
    },
    {
      title: "AI-Powered Solutions",
      description:
        "Integrate cutting-edge artificial intelligence to deliver smarter, data-driven marketing strategies.",
    },
    {
      title: "Sustainable Growth",
      description:
        "Build eco-conscious digital campaigns that drive results while minimizing environmental impact.",
    },
    {
      title: "Innovation Hub",
      description:
        "Create a research and development center focused on emerging marketing technologies and trends.",
    },
  ];

  return (
    <>
      <div className="relative min-h-screen bg-white overflow-hidden">
        {/* Flowing Ribbon SVG - Fixed Background */}
        <svg
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1440 3000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient
              id="ribbonGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#12a89d" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0d8579" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#12a89d" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Smooth Flowing Ribbon Path - Starting from top left */}
          <path
            d="M 50 100 Q 300 200 600 150 T 1200 300 Q 900 500 600 600 T 300 900 Q 500 1100 900 1200 T 1300 1500 Q 1000 1700 600 1800 T 300 2100 Q 500 2300 800 2400 T 1200 2700"
            fill="none"
            stroke="url(#ribbonGradient)"
            strokeWidth="60"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5000"
            strokeDashoffset={5000 - 5000 * scrollProgress}
            style={{
              transition: "stroke-dashoffset 0.05s linear",
              filter: "blur(1px)",
              opacity: 0.6,
            }}
          />

          {/* Static base path - always visible */}
          <path
            d="M 50 100 Q 300 200 600 150 T 1200 300 Q 900 500 600 600 T 300 900 Q 500 1100 900 1200 T 1300 1500 Q 1000 1700 600 1800 T 300 2100 Q 500 2300 800 2400 T 1200 2700"
            fill="none"
            stroke="url(#ribbonGradient)"
            strokeWidth="60"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "blur(1px)",
              opacity: 0.15,
            }}
          />
        </svg>

        {/* Title Section with Letter Animation - Reduced Height */}
        <section className="relative pt-32 pb-12 flex items-center justify-center px-4">
          <div className="relative z-10">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 text-center">
              {animationStarted &&
                visibleLetters.map((item, idx) => (
                  <span
                    key={`letter-${idx}`}
                    style={{
                      display: "inline-block",
                      opacity: 0,
                      transform: "translateY(0)",
                      animation: `slideUpLetter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                        idx * 0.08
                      }s forwards`,
                    }}
                  >
                    {item.letter === " " ? "\u00A0" : item.letter}
                  </span>
                ))}
            </h1>
          </div>
        </section>

        {/* Our Story Section - Reduced Padding */}
        <section className="relative py-12 px-4 md:px-32">
          <div
            className="max-w-4xl mx-auto relative z-10"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded in 2020 by a team of passionate digital marketing
                enthusiasts, Fibi Space emerged from a simple yet powerful
                vision: to democratize access to world-class digital marketing
                services for businesses of all sizes.
              </p>
              <p>
                What started as a small consultancy in Kathmandu has grown into
                a dynamic agency serving clients across the globe. Our founders
                recognized the gap between traditional marketing approaches and
                the rapidly evolving digital landscape, and set out to bridge
                that divide with innovative, results-driven strategies.
              </p>
              <p>
                Every campaign we launch, every strategy we develop, and every
                success story we create is rooted in our commitment to
                understanding our clients' unique needs and delivering
                measurable results that exceed expectations.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section - Reduced Padding */}
        <section className="relative py-12 px-4 md:px-32">
          <div
            className="max-w-4xl mx-auto relative z-10"
            style={{
              transform: `translateY(${scrollY * 0.04}px)`,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our Vision
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                To become the leading catalyst for digital transformation in
                South Asia, empowering businesses to achieve unprecedented
                growth through innovative marketing solutions.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We envision a future where every business, regardless of size or
                industry, has access to cutting-edge digital marketing
                strategies that drive real, measurable impact. Through
                continuous innovation, strategic partnerships, and an unwavering
                commitment to excellence, we're building a legacy of success
                stories that inspire and transform.
              </p>
            </div>
          </div>
        </section>

        {/* Future Goals Section - Reduced Padding */}
        <section className="relative py-12 px-4 md:px-32">
          <div
            className="max-w-5xl mx-auto relative z-10"
            style={{
              transform: `translateY(${scrollY * 0.03}px)`,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Where We're Heading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {futureGoals.map((goal, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#12a89d]/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#12a89d] to-[#0d8579] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#12a89d] transition-colors duration-300">
                        {goal.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Statement - Reduced Top Margin */}
        <section className="relative py-20 px-4 md:px-32 mt-12 bg-gradient-to-br from-[#12a89d] to-[#0d8579]">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Whether you're a startup looking to make your mark or an
              established business ready to scale, we're here to turn your
              digital dreams into reality.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
