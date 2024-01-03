const defaultTheme = require('tailwindcss/defaultTheme')

const colors = {
  yellow: '#FFF500',
  yellow2: '#FFC700',
  blue: '#2648EF',
  blue1: '#516DF2',
  blue2: '#1C2A89',
  green: '#29F863',
  black2: '#010101',
  grey2: '#8F8F8F'
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
      fontFamily: {
        psm: ['psm', ...defaultTheme.fontFamily.sans],
        pss: ['pss', ...defaultTheme.fontFamily.sans],
        smb: ['smb', ...defaultTheme.fontFamily.sans],
        sdm: ['sdm', ...defaultTheme.fontFamily.sans]
      },
      cursor: {
        default: 'url("/src/assets/illustrations/cursor-default.svg"), default',
        pointer: 'url("/src/assets/illustrations/cursor-pointer.svg"), pointer'
      },
      boxShadow: {
        'connectwallet-button': '6px 6px 0px 0px #919191',
        'whitepaper-button': '6px 6px 0px 0px #172B8F'
      },
      backgroundImage: {
        'connect-modal': 'url("/src/assets/illustrations/connect-bg.png")'
      }
    }
  },
  plugins: []
}
