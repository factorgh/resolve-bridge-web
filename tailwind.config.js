/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        magenta: {
          500: '#e91e63',
          600: '#d81b60',
        },
        'vibrant-purple': {
          500: '#9c27b0',
          600: '#8e24aa',
        }
      }
    },
  },
  plugins: [],
}

