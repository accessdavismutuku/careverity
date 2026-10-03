import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#152033",
        navy: "#0f2747",
        lqcs: {
          blue: "#1f6fbf",
          teal: "#11a7a5",
          mint: "#d8f3ef",
          sky: "#e7f2ff",
          line: "#d9e4f2"
        },
        care: {
          green: "#2f9f71",
          amber: "#c47a16",
          red: "#c94343",
          violet: "#7b61bf"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 39, 71, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
