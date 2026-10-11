/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        ink: '#0b0b0b',
        paper: '#f7f4ef',
        bone: '#ece7df',
        accent: '#d4ff3a',
        blush: '#e9d7cf',
        muted: '#7a7570',
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(0)', opacity: '0' }, '15%': { transform: 'scale(1.2)', opacity: '1' }, '30%': { transform: 'scale(0.95)' }, '45%,80%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(1)', opacity: '0' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        slideIn: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        blink: { '0%,80%,100%': { opacity: '0.2' }, '40%': { opacity: '1' } },
      },
      animation: {
        pop: 'pop 0.9s ease-out forwards',
        fadeUp: 'fadeUp 0.35s ease-out both',
        slideUp: 'slideUp 0.28s cubic-bezier(.2,.8,.2,1) both',
        slideIn: 'slideIn 0.28s cubic-bezier(.2,.8,.2,1) both',
        blink: 'blink 1.2s infinite',
      },
    },
  },
  plugins: [],
}
