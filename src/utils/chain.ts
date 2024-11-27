import { SuiChainId } from '@suiet/wallet-kit'
import { address } from 'bitcoinjs-lib'

import {
  suiMainnet,
  suiTestnet,
  zetaMainnet,
  zetaTestnet
} from '@/config/wagmi'

export const isZetaChain = (chain: number) => {
  return ([zetaTestnet.id, zetaMainnet.id] as number[]).includes(chain)
}

export const getSuiNetworkType = (chainId: number) => {
  if (chainId === suiMainnet.id) return SuiChainId.MAIN_NET
  if (chainId === suiTestnet.id) return SuiChainId.TEST_NET
  return undefined
}

export const isSuiChain = (chain: number) => {
  return ([suiMainnet.id, suiTestnet.id] as number[]).includes(chain) // TO DO
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
