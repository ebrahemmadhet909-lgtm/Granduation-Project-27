/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        navy:  { 700: '#15508f', 800: '#0f3a6b', 900: '#0a2a52' },
        brand: { 50: '#f2f8ff', 100: '#e3f0ff', 200: '#bfdcfb', 500: '#1688f0', 600: '#0f74d6' },
        accent: '#f58220',
        gold:   '#f5a31a',
        ok:   { DEFAULT: '#16a34a', bg: '#dcfce7' },
        bad:  { DEFAULT: '#e5484d', bg: '#fee2e2' },
        warn: { DEFAULT: '#d97706', bg: '#fef3c7' },
        plum: { DEFAULT: '#7c3aed', bg: '#ede9fe' },
        mute: { DEFAULT: '#64748b', bg: '#e8eef6' },
        ink:  '#0f2a4a',
        line: '#d9e6f6',
        page: '#eef5ff'
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', '"Helvetica Neue"', 'Arial', 'sans-serif']
      },
      boxShadow: {
        card: '0 4px 16px rgba(15, 58, 107, 0.08)'
      },
      keyframes: {
        'toast-in': { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'none' } }
      },
      animation: {
        'toast-in': 'toast-in 0.25s ease'
      }
    }
  }
};
