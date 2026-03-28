/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#2B0006",
          900: "#3D0009",
          800: "#5E0010",
          700: "#7A0010",
          600: "#9A0015",
          500: "#C1001A", // основной (красный)
        },
      },
      fontFamily: {
        display: ["Georgia", '"Times New Roman"', "Times", "serif"],
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Arial",
        ],
      },
      boxShadow: {
        glowGold: "0 0 0 1px rgba(201,161,74,.25), 0 0 30px rgba(201,161,74,.18)",
        glowBrand: "0 0 0 1px rgba(71,0,20,.35), 0 0 40px rgba(71,0,20,.35)",
      },
      backgroundImage: {
        luxeRadial:
          "radial-gradient(1000px 520px at 10% 0%, rgba(193,0,26,.10), transparent 60%), radial-gradient(900px 600px at 100% 20%, rgba(193,0,26,.08), transparent 55%), radial-gradient(1000px 700px at 50% 110%, rgba(15,23,42,.06), transparent 70%)",
        luxeLinear:
          "linear-gradient(135deg, rgba(71,0,20,.85) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 100%)",
      },
      backdropBlur: {
        luxe: "18px",
      },
      borderRadius: {
        luxe: "18px",
      },
    },
  },
  plugins: [],
};

