import { zetaMainnet, zetaTestnet } from '@/config/wagmi'

export const isZetaChain = (chain: number) => {
  return ([zetaTestnet.id, zetaMainnet.id] as number[]).includes(chain)
}
