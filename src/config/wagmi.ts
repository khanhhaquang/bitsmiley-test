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

export const bobTestnet = {
  id: 606808,
  name: 'BOB Testnet',
  nativeCurrency: { name: 'Sepolia ETH', symbol: 'SepETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia-dencun.rpc.gobob.xyz/'] }
  },
  blockExplorers: {
    default: {
      name: 'BOB Scan',
      url: 'https://sepolia-dencun.explorer.gobob.xyz/'
    }
  },
  testnet: true
} as const satisfies Chain

export const bSquaredTestnet = {
  id: 1102,
  name: 'B² Testnet',
  nativeCurrency: { name: 'tBTC', symbol: 'tBTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://haven-rpc.bsquared.network'] }
  },
  blockExplorers: {
    default: {
      name: 'B² Scan',
      url: 'https://haven-explorer.bsquared.network/'
    }
  },
  testnet: true
} as const satisfies Chain

export const botanixTestnet = {
  id: 3636,
  name: 'Botanix Testnet',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://node.botanixlabs.dev'] }
  },
  blockExplorers: {
    default: {
      name: 'Botanix Scan',
      url: 'https://blockscout.botanixlabs.dev/'
    }
  },
  testnet: true
} as const satisfies Chain

//TODO: PARTICLE DOES NOT SUPPORT BOB/BOTANIX YET
export const chainsNotSupportedByParticle: number[] = [
  botanixTestnet.id,
  bobTestnet.id
]

export const customChains = [
  merlinTestnet,
  merlinMainnet,
  bobTestnet,
  bSquaredTestnet
] as Chain[]
