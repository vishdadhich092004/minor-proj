/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode manually if needed, or stick to media/class strategy
  theme: {
    extend: {
      colors: {
        primary: '#2697FF',
        secondary: '#2A2D3E',
        bgColor: '#212332',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming Inter or similar for now
      }
    },
  },
  plugins: [],
}
