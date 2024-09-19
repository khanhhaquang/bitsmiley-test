import { customChains, zetaMainnet, zetaTestnet } from '@/config/wagmi'

export const isZetaChain = (chain: number) => {
  return ([zetaTestnet.id, zetaMainnet.id] as number[]).includes(chain)
}

export const isTestnet = (chain: number) => {
  const chainInfo = customChains.find((item) => item.id === chain)
  if (!chainInfo) return true
  return chainInfo.testnet
}
