import { http, createConfig } from 'wagmi'
import { type Chain } from 'viem'

export const merlinTestnet = {
  id: 686868,
  name: 'Merlin testnet',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.merlinchain.io'] }
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://testnet-scan.merlinchain.io' }
  },
  testnet: true,
  contracts: {}
} as const satisfies Chain

export const config = createConfig({
  chains: [merlinTestnet],
  transports: {
    [merlinTestnet.id]: http()
  }
})
