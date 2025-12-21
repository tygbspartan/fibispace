import React from "react";

const WorkTogether = () => {
  return (
    <section
      className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center gap-12 py-20"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      {/* Small text at top */}
      <div className="flex justify-between w-[45vw]">
        <p className="text-sm md:text-2xl uppercase tracking-widest mb-12 text-white">
          +
        </p>
        <p className="text-sm md:text-xl uppercase tracking-widest mb-12 text-white">
          READY TO UNLEASH YOUR WILDEST CONCEPTS?
        </p>
        <p className="text-sm md:text-2xl uppercase tracking-widest mb-12 text-white">
          +
        </p>
      </div>

      {/* Main heading */}
      <h2 className="text-[64px] md:text-[96px] lg:text-[120px] font-normal text-center leading-none mb-16 px-4">
        Let's work
        <br />
        together!
      </h2>
      {/* Bottom + decoration */}
      <div className="flex justify-between w-[45vw]">
        <p className="text-sm md:text-2xl uppercase tracking-widest mb-12 text-white">
          +
        </p>
        <p className="text-sm md:text-2xl uppercase tracking-widest mb-12 text-white">
          +
        </p>
        <p className="text-sm md:text-2xl uppercase tracking-widest mb-12 text-white">
          +
        </p>
      </div>
    </section>
  );
};

export default WorkTogether;
