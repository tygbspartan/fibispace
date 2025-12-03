module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
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
      },
      animation: {
        shrinkLogo: "shrinkLogo 0.6s linear forwards",
        expandLogo: "expandLogo 0.6s linear forwards",
        fadeOutOverlay: "fadeOutOverlay 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
