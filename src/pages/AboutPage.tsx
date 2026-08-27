import React, { useEffect } from "react";
import MissionVision from "../components/about/MissionVision";
import Process from "../components/about/Process";
import Team from "../components/about/Team";
import StatCounter from "../components/about/StatCounter";
import Footer from "../components/NewFooter";
import contentData from "../data/content.json";

const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";

// 70px at the top end: the home page keeps 72, every other page steps down.
const TITLE_SIZE =
  "text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]";

const AboutPage: React.FC = () => {
  const { about } = contentData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-site">
      <div className="px-6 md:px-12 lg:px-[120px] pt-[30px] md:pt-[100px] pb-[40px] md:pb-[60px]">
        {/* ---------- Everything held while the cards open ----------
            Marked as one group so MissionVision can pin it: heading, line,
            cards and stats together. Pinning inserts a screen of scroll under
            whatever it pins, so holding the cards alone is what pushed the
            stats off the screen — and because this reaches the top of the
            page, the hold begins on the very first scroll. */}
        <div
          data-about-pin
          className="md:min-h-[calc(100vh-100px)] md:flex md:flex-col md:justify-center"
        >
          {/* ---------- Opening ---------- */}
          <h1
            className={`text-center mx-auto max-w-4xl ${TITLE_SIZE}`}
            style={{
              fontFamily: MONTSERRAT,
              fontWeight: 400,
              lineHeight: 1.15,
            }}
          >
            {about.heading}
          </h1>
          <p
            className="mt-5 mx-auto max-w-2xl text-center text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
            style={{ fontFamily: INTER, fontWeight: 400, color: "#8A8A8A" }}
          >
            {about.intro}
          </p>

          {/* ---------- Mission and vision ---------- */}
          <MissionVision />

          {/* ---------- Stats ---------- */}
          <div className="pt-4 pb-[40px] md:py-[60px] flex flex-wrap justify-center gap-x-0 gap-y-8 md:gap-y-10">
            {about.stats.map((stat) => (
              <div key={stat.label} className="w-1/3 md:w-[300px] text-center">
                <StatCounter
                  value={stat.value}
                  className="block text-[14px] md:text-[24px] lg:text-[35px]"
                  style={{
                    fontFamily: MONTSERRAT,
                    fontWeight: 600,
                    color: "#111111",
                  }}
                />
                <p
                  className="mt-2 text-[12px] md:text-[16px] lg:text-[24px]"
                  style={{
                    fontFamily: INTER,
                    fontWeight: 300,
                    color: "#535353",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- How we work ---------- */}
        <Process />

        {/* ---------- Team ---------- */}
        <Team />
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
