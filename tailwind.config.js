/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Light Mode Brand Palette
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
        },
        // Dark Mode Semantic Palette
        surface: '#0f172a',
        background: '#10131a',
        'on-surface': '#f8fafc',
        'on-surface-variant': '#c2c6d6',
        'surface-container': '#1d2027',
        'surface-container-low': '#191b23',
        'surface-container-high': '#272a31',
        'surface-container-highest': '#32353c',
        outline: '#475569',
        'outline-variant': '#424754',
        primary: '#adc6ff',
        'on-primary': '#002e6a',
        'primary-container': '#4d8eff',
        error: '#ef4444',
        'error-container': '#93000a',
        'on-error': '#690005',
      },
    },
  },
  plugins: [],
};
