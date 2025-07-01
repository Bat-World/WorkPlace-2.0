import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./client/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        unbounded: ["var(--font-unbounded)"], 
      },
    },
  },
  plugins: [],
};

export default config;
