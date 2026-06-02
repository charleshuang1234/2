import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#05070f",
        surface: "rgba(12, 18, 32, 0.72)",
        "electric-blue": "#16d9ff",
        "neon-red": "#ff2b4a",
        "signal-gold": "#f9c74f",
        "chrome-white": "#f2f8ff"
      },
      boxShadow: {
        neonBlue: "0 0 24px rgba(22, 217, 255, 0.35)",
        neonRed: "0 0 24px rgba(255, 43, 74, 0.35)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        gradientPulse:
          "radial-gradient(1200px 600px at 20% 20%, rgba(22, 217, 255, 0.2), transparent 60%), radial-gradient(800px 500px at 80% 10%, rgba(255, 43, 74, 0.2), transparent 60%), linear-gradient(150deg, #05070f 10%, #0a1224 60%, #111827 100%)"
      },
      fontFamily: {
        display: ["var(--font-orbitron)", "sans-serif"],
        body: ["var(--font-rajdhani)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
