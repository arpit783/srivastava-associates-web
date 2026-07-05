import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1D3E",
          50: "#f0f4ff",
          100: "#d9e4f5",
          200: "#b3c9eb",
          300: "#8daee1",
          400: "#6793d7",
          500: "#4178cd",
          600: "#2d60b0",
          700: "#1e4a8a",
          800: "#0f3064",
          900: "#0B1D3E",
          950: "#06112a",
        },
        gold: {
          DEFAULT: "#C9A227",
          50: "#fdf9ed",
          100: "#faf0cc",
          200: "#f4df94",
          300: "#eeca58",
          400: "#e8b62a",
          500: "#C9A227",
          600: "#b08419",
          700: "#8c6415",
          800: "#724f14",
          900: "#5e4113",
          950: "#362206",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
