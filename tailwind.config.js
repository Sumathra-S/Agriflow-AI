/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f2f8f4',
          100: '#e1efe6',
          200: '#c5dfd0',
          600: '#1b6b3e',
          700: '#165833',
          800: '#13472b',
          900: '#0f3a23',
          950: '#072013',
        },
        risk: {
          low: '#15803d',
          'low-bg': '#f0fdf4',
          'low-border': '#bbf7d0',
          medium: '#b45309',
          'medium-bg': '#fffbeb',
          'medium-border': '#fde68a',
          high: '#b91c1c',
          'high-bg': '#fef2f2',
          'high-border': '#fecaca',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'gov-md': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
