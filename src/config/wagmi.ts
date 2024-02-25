import { http, createConfig } from 'wagmi'
import { Address, type Chain } from 'viem'

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

export const merlinAddresses = {
  [merlinTestnet.id]: '0xdD65F5D3a5AEE68769267a5663CCcD213b45ABaA'
} as Record<number, Address>

export const config = createConfig({
  chains: [merlinTestnet],
  transports: {
    [merlinTestnet.id]: http()
  }
})
