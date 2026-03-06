import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brass: {
          50: '#FBF7EE',
          100: '#F3EADA',
          200: '#E6D4B0',
          300: '#D4B97E',
          400: '#C8A96E',
          500: '#A38542',
          600: '#8B6F35',
          700: '#6E572A',
          800: '#5A4723',
          900: '#4A3B1E',
        },
        parchment: {
          50: '#FAF8F5',
          100: '#F2EDE6',
          200: '#E5DED3',
          300: '#D4CAB9',
          400: '#B8AA96',
          500: '#9A8F80',
          600: '#6B6158',
          700: '#504840',
          800: '#3D3529',
          900: '#2D2923',
        },
        chamber: {
          50: '#F5F3F0',
          100: '#E8E0D0',
          200: '#1E1B17',
          300: '#191613',
          400: '#161412',
          500: '#131110',
          600: '#0F0D0B',
          700: '#0C0B09',
          800: '#0A0908',
          900: '#070606',
        },
      },
      fontFamily: {
        serif: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 20% 80%, var(--mesh-1) 0%, transparent 50%), radial-gradient(at 80% 20%, var(--mesh-2) 0%, transparent 50%), radial-gradient(at 50% 50%, var(--mesh-3) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-brass': 'pulseBrass 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseBrass: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#E8E0D0',
            '--tw-prose-headings': '#E8E0D0',
            '--tw-prose-links': '#C8A96E',
            '--tw-prose-bold': '#E8E0D0',
            '--tw-prose-code': '#C8A96E',
            '--tw-prose-quotes': '#9A8F80',
          },
        },
      },
    },
  },
  plugins: [typography],
};
export default config;
