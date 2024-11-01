const defaultTheme = require('tailwindcss/defaultTheme')

const colors = {
  yellow: '#FFF500',
  yellow2: '#FFC700',
  yellow3: '#EAC641',
  yellow4: '#FFCA4A',
  yellow5: '#FFA100',
  blue: '#2648EF',
  blue1: '#516DF2',
  blue2: '#1C2A89',
  blue3: '#93A4F7',
  blue4: '#001992',
  blue5: '#172B8F',
  green: '#29F863',
  green2: '#41EAB7',
  green3: '#A4FFE4',
  green4: '#0ABB86',
  green5: '#0F712A',
  green6: '#39FF9B',
  black2: '#010101',
  grey2: '#8F8F8F',
  grey3: '#232323',
  grey4: '#3C3C3C',
  grey5: '#ffffff4d',
  grey6: '#949494',
  grey7: '#B9B9B9',
  grey8: '#2B2B2B',
  grey9: '#3D3D3D',
  grey10: '#464646',
  red: '#CE2D2D',
  red1: '#FF0000',
  pink: '#FF64AE',
  cyan: '#00FFD1',
  warning: '#F00',
  error: '#F00'
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: colors,
      screens: {
        sm: { max: '639px' },
        '3xl': '1960px'
      },
      keyframes: () => ({
        popOut: {
          '0%': { scale: '30%' },
          '100%': { scale: '100%' }
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      }),
      animation: {
        pop: 'popOut 150ms ease-in-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      fontFamily: {
        psm: ['psm', ...defaultTheme.fontFamily.sans],
        pss: ['pss', ...defaultTheme.fontFamily.sans],
        smb: ['smb', ...defaultTheme.fontFamily.sans],
        smb2: ['smb2', ...defaultTheme.fontFamily.sans],
        sdm: ['sdm', ...defaultTheme.fontFamily.sans],
        ppnb: ['ppnb', ...defaultTheme.fontFamily.sans],
        ppnr: ['ppnr', ...defaultTheme.fontFamily.sans],
        ibmr: [
          'ibmr',
          {
            fontFeatureSettings: "'ss03' on"
          }
        ],
        ibmb: [
          'ibmb',
          {
            fontFeatureSettings: "'ss03' on"
          }
        ]
      },
      cursor: {
        default: 'url("/src/assets/icons/cursor-default.svg") 8 0, default',
        pointer: 'url("/src/assets/icons/cursor-pointer.svg") 8 0, pointer'
      },
      boxShadow: {
        'connectwallet-button': '6px 6px 0px 0px #919191',
        'take-bitdisc-button': '3px 3px 0px 0px #919191',
        'connectwallet-button-hover': '6px 6px 0px 0px #2648EF',
        'take-bitdisc-button-hover': '3px 3px 0px 0px #2648EF',
        'whitepaper-button': '6px 6px 0px 0px #172B8F',
        'stake-now-button': '4px 4px 0px 0px rgba(0, 0, 0, 0.30)',
        'bitpoint-history-back-button':
          '0px 0px 5px 1px rgba(255, 255, 255, 0.06)'
      },
      backgroundImage: {
        bitUsdInputHeaderBg:
          'url("/src/assets/illustrations/bitusd/input-header-bg.png")',
        bitUsdContentBg:
          'radial-gradient(57.37% 53.83% at 48.72% 50%, #120E20 26.87%, #0E0D15 73.65%, #09080B 100%)',
        bitUsdBg: 'url("/src/assets/illustrations/bitusd-bg.webp")',
        bitpointPointBg:
          'url("/src/assets/illustrations/bitpoint/your-point-bg.png")',
        onchainLoading: 'url("/src/assets/illustrations/onchain-loading.png")',
        loading: 'url("/src/assets/illustrations/loading-bg.png")',
        mobile: 'url("/src/assets/illustrations/mobile-bg.png")',
        'connect-modal': 'url("/src/assets/illustrations/connect-bg.png")',
        'mint-success-modal':
          'url("/src/assets/illustrations/mint-success-modal-bg.png")',
        'gold-og':
          'linear-gradient(180deg, #FFC700 0%, #FFF8DD 19%, #8F6F00 45.5%, #FFC700 67%, #876A00 100%)',
        'express-black':
          'linear-gradient(90deg, #FFF 4.33%, #868686 30.27%, #FFF 38.38%, #434343 62.96%, #707070 69.23%, #FFF 79.63%, #696969 90.22%, #CCC 97.33%)',
        yourPointStats:
          'linear-gradient(124deg, rgba(38, 72, 239, 0.30) 16.19%, rgba(0, 8, 45, 0.30) 96.03%)',
        apyText:
          'linear-gradient(180deg, #86FFA8 11.11%, #86FFA8 30.28%, #00FF22 30.63%, #00FF22 60.85%, #00B221 61.48%, #00B221 74.07%)',
        arcadeMachineBg:
          'url("/src/assets/illustrations/arcade-machine-bg.gif")',
        prizeBg: 'url("/src/assets/illustrations/prize-bg.webp")',
        prizeBgActive:
          'url("/src/assets/illustrations/prize-bg-active.webp")'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
