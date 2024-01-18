const defaultTheme = require('tailwindcss/defaultTheme')

const colors = {
  yellow: '#FFF500',
  yellow2: '#FFC700',
  yellow3: '#EAC641',
  blue: '#2648EF',
  blue1: '#516DF2',
  blue2: '#1C2A89',
  blue3: '#93A4F7',
  green: '#29F863',
  green2: '#41EAB7',
  black2: '#010101',
  grey2: '#8F8F8F',
  grey3: '#232323',
  grey4: '#3C3C3C',
  red: '#CE2D2D',
  pink: '#FF64AE'
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
        default: 'url("/src/assets/icons/cursor-default.svg"), default',
        pointer: 'url("/src/assets/icons/cursor-pointer.svg"), pointer'
      },
      boxShadow: {
        'connectwallet-button': '6px 6px 0px 0px #919191',
        'take-bitdisc-button': '3px 3px 0px 0px #919191',
        'connectwallet-button-hover': '6px 6px 0px 0px #2648EF',
        'take-bitdisc-button-hover': '3px 3px 0px 0px #2648EF',
        'whitepaper-button': '6px 6px 0px 0px #172B8F'
      },
      backgroundImage: {
        loading: 'url("/src/assets/illustrations/loading-bg.png")',
        'connect-modal': 'url("/src/assets/illustrations/connect-bg.png")',
        'gold-og':
          'linear-gradient(180deg, #FFC700 0%, #FFF8DD 19%, #8F6F00 45.5%, #FFC700 67%, #876A00 100%)',
        'express-black':
          'linear-gradient(90deg, #FFF 4.33%, #868686 30.27%, #FFF 38.38%, #434343 62.96%, #707070 69.23%, #FFF 79.63%, #696969 90.22%, #CCC 97.33%)'
      }
    }
  },
  plugins: []
}
