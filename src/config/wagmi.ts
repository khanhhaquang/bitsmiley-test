import { type Chain } from 'viem'
import { holesky, mainnet } from 'viem/chains'

export const merlinTestnet = {
  id: 686868,
  name: 'Merlin Testnet',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://merlin-testnet.blockpi.network/v1/rpc/648b991f0022274a55d528cb126e1a63fa4b84a1'
      ]
    }
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

export const bitLayerTestnet = {
  id: 200810,
  name: 'Bitlayer Testnet',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.bitlayer.org'] }
  },
  blockExplorers: {
    default: {
      name: 'Bitlayer Testnet Scan',
      url: 'https://testnet.btrscan.com'
    }
  },
  testnet: true
} as const satisfies Chain

export const bitLayerMainnet = {
  id: 200901,
  name: 'Bitlayer',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.bitlayer.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'Bitlayer Scan',
      url: 'https://btrscan.com'
    }
  },
  testnet: false
} as const satisfies Chain

export const zetaTestnet = {
  id: 7001,
  name: 'Zeta Testnet',
  nativeCurrency: { name: 'ZETA', symbol: 'ZETA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public']
    }
  },
  blockExplorers: {
    default: {
      name: 'Zeta Testnet Scan',
      url: 'https://athens.explorer.zetachain.com'
    }
  },
  testnet: true
} as const satisfies Chain

export const zetaMainnet = {
  id: 7000,
  name: 'Zeta Mainnet',
  nativeCurrency: { name: 'ZETA', symbol: 'ZETA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://zetachain-mainnet.public.blastapi.io']
    }
  },
  blockExplorers: {
    default: {
      name: 'Zeta Testnet Scan',
      url: 'https://explorer.zetachain.com'
    }
  },
  testnet: false
} as const satisfies Chain

export const suiTestnet = {
  id: 103,
  name: 'Sui Testnet',
  nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sui-testnet-endpoint.blockvision.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'Sui Testnet Scan',
      url: 'https://suiscan.xyz/testnet'
    }
  },
  testnet: true
} as const satisfies Chain

export const suiMainnet = {
  id: 101,
  name: 'Sui Mainnet',
  nativeCurrency: { name: 'SUI', symbol: 'SUI', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sui-mainnet-endpoint.blockvision.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'Sui Mainnet Scan',
      url: 'https://suiscan.xyz/mainnet'
    }
  },
  testnet: true
} as const satisfies Chain

//TODO: PARTICLE DOES NOT SUPPORT THESE CHAINS YET
export const chainsNotSupportedByParticle: number[] = [
  botanixTestnet.id,
  bobTestnet.id,
  bitLayerTestnet.id,
  bitLayerMainnet.id,
  zetaTestnet.id,
  zetaMainnet.id,
  suiTestnet.id,
  suiMainnet.id
]

export const customChains = [
  merlinTestnet,
  merlinMainnet,
  bobTestnet,
  bSquaredTestnet,
  bitLayerTestnet,
  bitLayerMainnet,
  zetaTestnet,
  zetaMainnet,
  holesky,
  mainnet
] as Chain[]
