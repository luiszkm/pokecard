/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('tailwindcss-animated')
  ],
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        fire: "#FF0000",
        water: "#0000FF",
        grass: "#00FF00",
        electric: "#FFFF00",
        ice: "#00FFFF",
        fighting: "#FF00FF",
        poison: "#800080",
        ground: "#808000",
        flying: "#008080",
        psychic: "#FFA500",
        bug: "#A52A2A",
        rock: "#808080",
        ghost: "#000080",
        dark: "#000000",
        dragon: "#800000",
        steel: "#C0C0C0",
        fairy: "#FFC0CB",
        normal: "#FFFFFF",
        shadow: "#FFFFFF",
        unknown: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      height :{
        card: "480px",
        cardDetails: "600px",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}