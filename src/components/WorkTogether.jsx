import React from "react";

const WorkTogether = () => {
  return (
    <section
      className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8 sm:gap-12 py-12 sm:py-16 md:py-20"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        overflowX: "hidden"
      }}
    >
      {/* Small text at top */}
      <div className="flex justify-between w-[85vw] sm:w-[70vw] md:w-[60vw] lg:w-[45vw] px-4">
        <p className="text-lg sm:text-xl md:text-2xl text-white">
          +
        </p>
        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wider sm:tracking-widest text-white text-center">
          READY TO UNLEASH YOUR WILDEST CONCEPTS?
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-white">
          +
        </p>
      </div>

      {/* Main heading */}
      <h2 className="text-[48px] sm:text-[64px] md:text-[96px] lg:text-[120px] font-normal text-center leading-none px-4">
        Let's work
        <br />
        together!
      </h2>

      {/* Bottom + decoration */}
      <div className="flex justify-between w-[85vw] sm:w-[70vw] md:w-[60vw] lg:w-[45vw] px-4">
        <p className="text-lg sm:text-xl md:text-2xl text-white">
          +
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-white">
          +
        </p>
        <p className="text-lg sm:text-xl md:text-2xl text-white">
          +
        </p>
      </div>
    </section>
  );
};

export default WorkTogether;