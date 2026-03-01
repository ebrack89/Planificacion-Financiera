/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark-plum': '#0C0420',
        'brand-deep-purple': '#5D3C64',
        'brand-muted-purple': '#7B466A',
        'brand-soft-purple': '#9F6496',
        'brand-light-pink': '#D391B0',
        'brand-rose-pink': '#BA6E8F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
