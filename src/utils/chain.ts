import { address } from 'bitcoinjs-lib'

import { zetaMainnet, zetaTestnet } from '@/config/wagmi'

export const isZetaChain = (chain: number) => {
  return ([zetaTestnet.id, zetaMainnet.id] as number[]).includes(chain)
}

export const isBtcTaprootAddress = (btcAddress: string) => {
  try {
    const decoded = address.fromBech32(btcAddress)
    if (decoded.version === 1) {
      console.log('The address is in Bech32m format (Taproot).')
      return true
    }
    return false
  } catch {
    return false
  }
}
