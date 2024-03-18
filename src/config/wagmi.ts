import { type Chain } from 'viem'

export const merlinTestnet = {
  id: 686868,
  name: 'Merlin Testnet',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.merlinchain.io'] }
  },
  blockExplorers: {
    default: { name: 'Merlinscan', url: 'https://testnet-scan.merlinchain.io' }
  },
  testnet: true
} as const satisfies Chain

export const merlinMainnet = {
  id: 4200,
  name: 'Merlin',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.merlinchain.io'] }
  },
  blockExplorers: {
    default: { name: 'Merlinscan', url: 'https://scan.merlinchain.io' }
  },
  testnet: false
} as const satisfies Chain

export const customChains = [merlinTestnet, merlinMainnet] as Chain[]
