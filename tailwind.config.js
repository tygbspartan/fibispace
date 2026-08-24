/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // Cloud drifting sideways. Only a transform moves, so the layers stay
        // on the compositor and nothing repaints as they go.
        //
        // Four stops rather than two, and no stop is the mirror of another,
        // so the loop never reads as a shuttle going back and forth.
        cloudFar: {
          "0%": { transform: "translate3d(-7%, 0, 0) scale(1.06)" },
          "33%": { transform: "translate3d(1%, -3%, 0) scale(1.14)" },
          "66%": { transform: "translate3d(7%, 1.5%, 0) scale(1.08)" },
          "100%": { transform: "translate3d(-7%, 0, 0) scale(1.06)" },
        },
        cloudNear: {
          "0%": { transform: "translate3d(8%, 2%, 0) scale(1.1)" },
          "40%": { transform: "translate3d(-2%, -2.5%, 0) scale(1.02)" },
          "72%": { transform: "translate3d(-8%, 1%, 0) scale(1.12)" },
          "100%": { transform: "translate3d(8%, 2%, 0) scale(1.1)" },
        },
        shrinkLogo: {
          "0%": {
            transform: "translate(-50%, -50%) scale(40) rotate(-110deg)",
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
          },
        },

        expandLogo: {
          "0%": {
            transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
            opacity: 1,
          },
          "100%": {
            transform: "translate(-50%, -50%) scale(40) rotate(110deg)",
            opacity: 0,
          },
        },

        fadeOutOverlay: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },

        // Half a track-width of travel. The track holds two copies of its
        // contents, so ending at -50% lands exactly on the start of the second
        // copy and the loop is invisible.
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },

        // A nudge downward, for the scroll hint.
        scrollHint: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.55" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },

        // Each phrase in the hero rises into place as it takes its turn.
        wordIn: {
          from: { opacity: "0", transform: "translateY(0.3em)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },

        // A restless arrow: drifts back and forth rather than nudging once
        // and stopping.
        nudge: {
          "0%, 100%": { transform: "translateX(-2px)" },
          "50%": { transform: "translateX(4px)" },
        },

        // Scrolls a double-width sine path by exactly one period, so the
        // waveform reads as a line rippling up and down.
        waveScroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-24px)" },
        },
      },
      animation: {
        // Deliberately not multiples of one another, so the two layers do not
        // come back into the same arrangement on any short cycle.
        cloudFar: "cloudFar 38s ease-in-out infinite",
        cloudNear: "cloudNear 27s ease-in-out infinite",
        shrinkLogo: "shrinkLogo 0.8s linear forwards",
        expandLogo: "expandLogo 0.8s linear forwards",
        fadeOutOverlay: "fadeOutOverlay 0.4s ease-out forwards",
        waveScroll: "waveScroll 1.8s linear infinite",
        nudge: "nudge 1.1s ease-in-out infinite",
        wordIn: "wordIn 0.45s ease-out",
        scrollHint: "scrollHint 1.6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
      lineClamp: {
        7: "7",
        8: "8",
        9: "9",
        10: "10",
      },
      screens: {
        nlg: "1400px",
        // The top of every type ramp. Held back to 1700 so the common laptop
        // and small-desktop widths — 1440, 1536, 1600, 1680 — take the 2xl step
        // instead: the largest sizes are drawn for a 1920 screen and read as
        // oversized on a 1600.
        slg: "1700px",
        // Full-HD monitors and up. Set below 1920 because a maximised browser
        // on a 1920 display reports roughly 1900 once the scrollbar is taken
        // out — a literal 1920 breakpoint would never match.
        wide: "1800px",
        // Height, not width. Laptops are wide enough for the large type but
        // short enough that a full-height hero runs out of room, which no
        // width breakpoint can detect. Declared last so it wins.
        short: { raw: "(max-height: 820px)" },
      },
      colors: {
        primary: "#12A89C",
        "primary-dark": "#0F9186",
        // Site-wide page background
        site: "#FFFFFF",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};
