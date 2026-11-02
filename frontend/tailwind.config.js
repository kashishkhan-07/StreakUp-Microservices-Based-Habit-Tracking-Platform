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
          blue: '#1E40AF',
          primary: '#2547D0',
          light: '#EAF0FD',
          dark: '#132152',
          accent: '#10B981',
          purple: '#8B5CF6',
          bg: '#F4F6FB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}