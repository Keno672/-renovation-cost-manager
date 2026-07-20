/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1d2925',
        paper: '#f6f4ee',
        evergreen: '#173f35',
        clay: '#c56845',
        mist: '#e5e8df',
      },
      boxShadow: { soft: '0 12px 40px rgba(29, 41, 37, 0.08)' },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
