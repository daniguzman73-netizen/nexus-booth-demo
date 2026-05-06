/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nexus-red':        '#C8102E',
        'nexus-red-dark':   '#A50D25',
        'nexus-red-subtle': 'rgba(200,16,46,0.08)',
        'verified-green':        '#1A7F37',
        'verified-green-bg':     '#DCFCE7',
        'warning-yellow':        '#D97706',
        'warning-yellow-bg':     '#FEF3C7',
        'body-text':    '#111827',
        'secondary':    '#6B7280',
        'border-gray':  '#E5E7EB',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"',
          'system-ui', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      keyframes: {
        floatA: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%':      { transform: 'translate(20px, -30px) scale(1.04)' },
        },
        floatB: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%':      { transform: 'translate(-15px, 25px) scale(0.97)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'float-a':    'floatA 9s ease-in-out infinite',
        'float-b':    'floatB 7s ease-in-out infinite',
        'fade-in':    'fadeIn 0.25s ease-out both',
        'slide-up':   'slideUp 0.25s ease-out both',
        'ticker':     'ticker 28s linear infinite',
      },
    },
  },
  plugins: [],
}
