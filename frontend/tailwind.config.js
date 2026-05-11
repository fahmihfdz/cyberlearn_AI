/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        card: '#0F172A',
        primary: '#06B6D4',
        secondary: '#22C55E',
      },
      fontFamily: {
        sans: ['"Fira Code"', 'monospace'],
        mono: ['"Fira Code"', 'monospace'],
      }
    },
  },
  plugins: [],
}
