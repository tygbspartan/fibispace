import { useEffect, useState, useRef } from "react";

export default function LoadingOverlay({
  isActive,
  backendReady,
}: {
  isActive: boolean;
  backendReady: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "complete" | "fade" | "done">(
    "loading",
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate progress 0 → ~90 while waiting for backend
  useEffect(() => {
    if (!isActive) return;

    setProgress(0);
    setPhase("loading");

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; // Hard cap while waiting for backend
        if (prev >= 90) {
          return prev + 0.2;
        }
        const increment = Math.max(0.5, (90 - prev) / 20);
        return Math.min(prev + increment, 92);
      });
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  // When backend responds, snap to 100 and fade
  useEffect(() => {
    if (backendReady && isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Snap to 100
      setProgress(100);
      setPhase("complete");

      // Start fade after a short pause
      const fadeTimer = setTimeout(() => setPhase("fade"), 400);
      const doneTimer = setTimeout(() => setPhase("done"), 900);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [backendReady, isActive]);

  if (!isActive || phase === "done") return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] bg-white 
        flex flex-col items-center justify-center gap-8
        overflow-hidden transition-opacity duration-500
        ${phase === "fade" ? "opacity-0" : "opacity-100"}
      `}
    >
      {/* Logo */}
      <img
        src="/assets/fibiBlack.png"
        alt="Fibi Loading"
        className={`
          w-24
          ${phase === "loading" ? "animate-pulse" : ""}
          ${phase === "complete" ? "scale-110 transition-transform duration-300" : ""}
        `}
      />

      {/* Progress section */}
      <div className="w-64 flex flex-col items-center gap-3">
        {/* Percentage */}
        <span className="text-sm font-medium text-gray-500 tabular-nums">
          {Math.min(Math.round(progress), 100)}%
        </span>

        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
