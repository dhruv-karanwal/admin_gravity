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
        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        secondary: "var(--secondary)",
        "deep-gravity": "var(--deep-gravity)",
        surface: "var(--surface)",
        "surface-low": "var(--surface-low)",
        "surface-lowest": "var(--surface-lowest)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        tertiary: "var(--tertiary)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        error: "var(--error)",
        "outline-variant": "var(--outline-variant)",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "ambient-glow": "var(--ambient-glow)",
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem",
      },
      spacing: {
        "sidebar": "var(--sidebar-width)",
        "header": "var(--header-height)",
      }
    },
  },
  plugins: [],
};
export default config;
