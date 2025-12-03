import { useEffect, useState } from "react";

export default function LoadingOverlay({ isActive, phaseTimer }) {
  const [phase, setPhase] = useState("start");
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    setPhase("shrink");
    setShowLogo(true);

    // shrink (1.2s) + pause (1s)
    const expandTimer = setTimeout(() => {
      setPhase("expand");
    }, phaseTimer + 400);

    // hide the logo right after expand animation ends (1.2s)
    const hideLogoTimer = setTimeout(() => {
      setShowLogo(false);
    }, phaseTimer + 400 + phaseTimer);

    // fade overlay after expansion
    const fadeTimer = setTimeout(() => {
      setPhase("fade");
    }, phaseTimer + 400 + phaseTimer);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(hideLogoTimer);
      clearTimeout(fadeTimer);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] 
        bg-white 
        flex items-center justify-center
        overflow-hidden
        ${phase === "fade" ? "animate-fadeOutOverlay" : ""}
      `}
    >
      {showLogo && (
        <img
          src="/assets/fibiGreen.png"
          alt="FibiLoading"
          className={`
            absolute top-1/2 left-1/2 
            w-24
            -translate-x-1/2 -translate-y-1/2
            ${phase === "shrink" ? "animate-shrinkLogo" : ""}
            ${phase === "expand" ? "animate-expandLogo" : ""}
          `}
        />
      )}
    </div>
  );
}
