/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        morning: {
          50: '#fdfbf7',
          100: '#f7f2ea',
          200: '#efe5d5',
          300: '#e3d2b9',
          400: '#d4b997',
          500: '#c59f77',
          600: '#b4855d',
          700: '#966a4b',
          800: '#7a553f',
          900: '#644735',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#cfdccf',
          300: '#abc1ac',
          400: '#83a184',
          500: '#648465',
          600: '#4d694e',
          700: '#3f5440',
          800: '#344435',
          900: '#2c392d',
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
