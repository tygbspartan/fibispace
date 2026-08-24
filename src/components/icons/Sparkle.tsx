import React from "react";
import type { LucideProps } from "lucide-react";

/**
 * `tabler:sparkle`, inlined.
 *
 * Same reasoning as IdeaBulb, TrafficLight and QuoteMark: pulling one glyph
 * from @iconify registers the whole collection into the bundle.
 */
const Sparkle: React.FC<LucideProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12c-6.597 0-9 2.403-9 9c0-6.597-2.403-9-9-9c6.597 0 9-2.403 9-9c0 6.597 2.403 9 9 9"
    />
  </svg>
);

export default Sparkle;
