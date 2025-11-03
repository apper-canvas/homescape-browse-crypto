/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a2332',
        secondary: '#2c3e50',
        accent: '#d4af37',
        surface: '#ffffff',
        background: '#f8f9fa',
        success: '#27ae60',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'heart-pop': 'heart-pop 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        'slide-out-right': 'slide-out-right 0.35s ease-out',
      },
      keyframes: {
        'heart-pop': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      }
    },
  },
  plugins: [],
}