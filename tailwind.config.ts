import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ABAB5',
          50: '#e6f9f8',
          100: '#ccf2f1',
          200: '#99e6e3',
          300: '#66d9d5',
          400: '#33cdc7',
          500: '#0ABAB5',
          600: '#089891',
          700: '#06726d',
          800: '#044c49',
          900: '#022624',
        },
        teal: {
          50: '#e6f9f8',
          100: '#ccf2f1',
          200: '#99e6e3',
          300: '#66d9d5',
          400: '#33cdc7',
          500: '#0ABAB5',
          600: '#089891',
          700: '#06726d',
          800: '#044c49',
          900: '#022624',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}

export default config
