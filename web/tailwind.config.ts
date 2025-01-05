import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0b0d",
        foreground: "#ffffff",
        primary: "#ff007a",
        secondary: "#1e1e2f",
        accent: "#8a2be2",
      },
      gradientColorStops: {
        "brand-gradient-start": "#ff007a",
        "brand-gradient-end": "#8a2be2",
      },
      fontFamily: {
        geistSans: ["var(--font-geist-sans)", "sans-serif"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
        manrope: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        "custom-bg": "url('/images/Background.png')",
      },
    },
  },
  plugins: [],
};

export default config;
