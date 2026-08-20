/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F5F1EB',
        alternate: '#EFE8DF',
        section3: '#F8F5F1',
        card: '#FAF7F2',
        ink: '#1A1A1A',
        accent: '#8B3A3A',
        'accent-soft': 'rgba(139, 58, 58, 0.10)',
        'accent-mid': 'rgba(139, 58, 58, 0.35)',
        line: 'rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '7xl': ['72px', '1.02'],
        '8xl': ['96px', '1'],
        '9xl': ['120px', '0.98'],
        '10xl': ['140px', '0.95'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        'widest-2': '0.2em',
      },
      transitionTimingFunction: {
        'power4-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'power3-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        soft: '0 30px 60px -25px rgba(26, 26, 26, 0.18)',
        card: '0 12px 40px -14px rgba(26, 26, 26, 0.10)',
        lift: '0 40px 80px -30px rgba(26, 26, 26, 0.28)',
        glow: '0 0 0 1px rgba(139, 58, 58, 0.08), 0 24px 60px -24px rgba(139, 58, 58, 0.25)',
      },
      borderWidth: {
        hairline: '0.5px',
      },
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 24s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

