import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced Vibrant Palette for Light Mode
        "vibrant-orange": {
          50: "var(--vibrant-orange-50)",
          100: "var(--vibrant-orange-100)",
          200: "var(--vibrant-orange-200)",
          300: "var(--vibrant-orange-300)",
          400: "var(--vibrant-orange-400)",
          500: "var(--vibrant-orange-500)", // Main vibrant orange
          600: "var(--vibrant-orange-600)",
          700: "var(--vibrant-orange-700)",
          800: "var(--vibrant-orange-800)",
          900: "var(--vibrant-orange-900)",
          950: "var(--vibrant-orange-950)",
        },
        "vibrant-pink": {
          50: "var(--vibrant-pink-50)",
          100: "var(--vibrant-pink-100)",
          200: "var(--vibrant-pink-200)",
          300: "var(--vibrant-pink-300)",
          400: "var(--vibrant-pink-400)",
          500: "var(--vibrant-pink-500)", // Main vibrant pink
          600: "var(--vibrant-pink-600)",
          700: "var(--vibrant-pink-700)",
          800: "var(--vibrant-pink-800)",
          900: "var(--vibrant-pink-900)",
          950: "var(--vibrant-pink-950)",
        },
        // New Energetic Colors
        "vibrant-purple": {
          50: "var(--vibrant-purple-50)",
          100: "var(--vibrant-purple-100)",
          200: "var(--vibrant-purple-200)",
          300: "var(--vibrant-purple-300)",
          400: "var(--vibrant-purple-400)",
          500: "var(--vibrant-purple-500)",
          600: "var(--vibrant-purple-600)",
          700: "var(--vibrant-purple-700)",
          800: "var(--vibrant-purple-800)",
          900: "var(--vibrant-purple-900)",
        },
        "vibrant-blue": {
          50: "var(--vibrant-blue-50)",
          100: "var(--vibrant-blue-100)",
          200: "var(--vibrant-blue-200)",
          300: "var(--vibrant-blue-300)",
          400: "var(--vibrant-blue-400)",
          500: "var(--vibrant-blue-500)",
          600: "var(--vibrant-blue-600)",
          700: "var(--vibrant-blue-700)",
          800: "var(--vibrant-blue-800)",
          900: "var(--vibrant-blue-900)",
        },
        "vibrant-green": {
          50: "var(--vibrant-green-50)",
          100: "var(--vibrant-green-100)",
          200: "var(--vibrant-green-200)",
          300: "var(--vibrant-green-300)",
          400: "var(--vibrant-green-400)",
          500: "var(--vibrant-green-500)",
          600: "var(--vibrant-green-600)",
          700: "var(--vibrant-green-700)",
          800: "var(--vibrant-green-800)",
          900: "var(--vibrant-green-900)",
        },
        "vibrant-yellow": {
          50: "var(--vibrant-yellow-50)",
          100: "var(--vibrant-yellow-100)",
          200: "var(--vibrant-yellow-200)",
          300: "var(--vibrant-yellow-300)",
          400: "var(--vibrant-yellow-400)",
          500: "var(--vibrant-yellow-500)",
          600: "var(--vibrant-yellow-600)",
          700: "var(--vibrant-yellow-700)",
          800: "var(--vibrant-yellow-800)",
          900: "var(--vibrant-yellow-900)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 6s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
