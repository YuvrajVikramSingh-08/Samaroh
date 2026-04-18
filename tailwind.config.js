/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0E1A',
          lighter: '#111827',
        },
        primary: {
          DEFAULT: '#E8006F',
          hover: '#FF1A8C',
        },
        warning: '#F97316',
        text: {
          DEFAULT: '#F1F5F9',
          muted: '#9CA3AF',
        }
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
