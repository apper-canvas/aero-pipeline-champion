/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          500: '#1e3a5f',
          600: '#2c5f8d',
        },
        coral: {
          500: '#ff6b6b',
        },
        surface: '#ffffff',
        background: '#f5f7fa',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
      },
      borderRadius: {
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'lifted': '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}