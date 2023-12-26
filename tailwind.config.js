const defaultTheme = require('tailwindcss/defaultTheme')

const colors = {
  yellow: '#FFF500',
  yellow2: '#FFC700',
  blue: '#2648EF',
  blue2: '#1C2A89',
  green: '#29F863'
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      colors: colors,
      backgroundImage: {
        bitSpace: "url('./src/assets/illustrations/bit-space.png')",
        bitGlobal1: "url('./src/assets/illustrations/bit-global-1.png')",
        bitGlobal2: "url('./src/assets/illustrations/bit-global-2.png')"
      },
      fontFamily: {
        psm: ['psm', ...defaultTheme.fontFamily.sans],
        pss: ['pss', ...defaultTheme.fontFamily.sans],
        smb: ['smb', ...defaultTheme.fontFamily.sans]
      },
      keyframes: {
        slide: {
          '0%': {
            transform: 'translateX(0)'
          },
          '100%': {
            transform: 'translateX(-100%)'
          }
        }
      }
    }
  },
  plugins: []
}
