/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#1A1A1D',      // Dark Iron Grey
          primary: '#FFB703', // Amber
          accent: '#38BDF8',  // Bright Blue
          text: '#FFFFFF',    // White
        }
      },
      fontFamily: {
        rounded: ['"Varela Round"', 'sans-serif'], // Rounded font
        mono: ['"Share Tech Mono"', 'monospace'],   // Tech font
      },
      backgroundImage: {
        'tech-grid': "linear-gradient(to right, #2a2a2e 1px, transparent 1px), linear-gradient(to bottom, #2a2a2e 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
