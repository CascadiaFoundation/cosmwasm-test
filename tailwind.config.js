const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./{components,contexts,hooks,pages,utils}/**/*.{js,cjs,mjs,ts,tsx}'],

  theme: {
    extend: {
      colors: {
        cascadia: { DEFAULT: '#2B70BE' },
        dark: { DEFAULT: '#06090B' },
        gray: { DEFAULT: '#F3F6F8' },
        'dark-gray': { DEFAULT: '#191D20' },
        purple: { DEFAULT: '#7E5DFF' },
        primary: {
          300: '#0064c8',
          400: '#004b96',
          500: '#003264',
          600: '#001932',
          700: '#181C1F',
        },
        'main-900': '#4267B3',
        'secondary-100': '#E9EBEE',
        'secondary-200': '#F6F7F8',
        'primary-500': '#616771',
        'primary-900': '#18191A',
        'footer-text': '#B0B3B8',
        'primary-blue': '#003264',
        neutral: colors.neutral,
        plumbus: {
          DEFAULT: '#2B70BE',
          light: '#2B70BE',
          matte: '#2B70BE',
          dark: '#2B70BE',
          10: '#2B70BE',
          20: '#2B70BE',
          30: '#2B70BE',
          40: '#2B70BE',
          50: '#2B70BE',
          60: '#2B70BE',
          70: '#2B70BE',
          80: '#2B70BE',
          90: '#2B70BE',
          100: '#2B70BE',
          110: '#2B70BE',
          120: '#2B70BE',
        },
        twitter: { DEFAULT: '#1DA1F2' },
      },
      fontFamily: {
        heading: ["'Montserrat'", ...defaultTheme.fontFamily.sans],
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
    },
  },

  plugins: [
    // tailwindcss official plugins
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/line-clamp'),

    // custom gradient background
    plugin(({ addUtilities }) => {
      addUtilities({
        '.cascadiad-gradient-bg': {
          background: `linear-gradient(63.38deg, rgba(29, 24, 24, 0.25) 45.06%, rgba(10, 50, 185, 0.25) 100.6%), #353841`,
        },
        '.cascadiad-gradient-brand': {
          background: `linear-gradient(102.33deg, #5883F1 10.96%, #FFFFFF 93.51%)`,
        },
      })
    }),
  ],
}
