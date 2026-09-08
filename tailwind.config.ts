import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          start: '#0a0a0a',
          end: '#1a1a2e',
        },
        surface: {
          DEFAULT: '#16162a',
          lighter: '#1e1e36',
        },
        primary: {
          DEFAULT: '#7c3aed',
          hover: '#6d28d9',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-up': 'floatUp 3s ease-in-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0' },
          '10%': { opacity: '1', transform: 'translateY(-20px) scale(1.1)' },
          '100%': { transform: 'translateY(-200px) scale(1)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
