/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3A0CA3', // Deep Purple
        secondary: '#4CC9F0', // Bright Blue
        tertiary: '#F72585', // Vibrant Pink
        neutral: {
          dark: '#121212', // Almost Black
          light: '#F8F9FA', // Off White
          mid: '#E9ECEF', // Light Gray
        },
        success: '#4CAF50', // Green
        warning: '#FF9800', // Orange
        error: '#F44336', // Red
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
    },
  },
  plugins: [],
} 