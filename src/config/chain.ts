import { Chain, holesky, mainnet } from 'viem/chains'

import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { isProduction } from '@/utils/helpers'

import {
  bitLayerMainnet,
  bitLayerTestnet,
  bobTestnet,
  botanixTestnet,
  bSquaredTestnet,
  merlinMainnet,
  merlinTestnet,
  suiMainnet,
  suiTestnet,
  zetaMainnet,
  zetaTestnet
} from './wagmi'

export const chainsIconUrl: { [key: string]: string } = {
  [merlinMainnet.id]: getIllustrationUrl('merlin-chain-logo', 'webp'),
  [merlinTestnet.id]: getIllustrationUrl('merlin-chain-logo', 'webp'),
  [bobTestnet.id]: getIllustrationUrl('bob-chain-logo', 'webp'),
  [bSquaredTestnet.id]: getIllustrationUrl('bsquared-chain-logo', 'webp'),
  [botanixTestnet.id]: getIllustrationUrl('botanix-chain-logo', 'webp'),
  [bitLayerTestnet.id]: getIllustrationUrl('bitlayer-chain-logo', 'webp'),
  [bitLayerMainnet.id]: getIllustrationUrl('bitlayer-chain-logo', 'webp'),
  [zetaTestnet.id]: getIllustrationUrl('zeta-chain-logo', 'webp'),
  [zetaMainnet.id]: getIllustrationUrl('zeta-chain-logo', 'webp'),
  [holesky.id]: getIllustrationUrl('ethereum-chain-logo', 'webp'),
  [mainnet.id]: getIllustrationUrl('ethereum-chain-logo', 'webp'),
  [suiTestnet.id]: getIllustrationUrl('sui-chain-logo', 'webp'),
  [suiMainnet.id]: getIllustrationUrl('sui-chain-logo', 'webp')
} as const

export const stakeSupportedChainIds = [
  merlinTestnet.id,
  merlinMainnet.id
] as const as number[]

export const aaSupportedChainIds = [
  merlinTestnet.id,
  merlinMainnet.id
] as const as number[]

export const HIGH_GAS_FEE_CHAIN_IDS = [
  bitLayerTestnet.id,
  bitLayerMainnet.id
] as const as number[]

export const connectChains = [
  suiTestnet,
  suiMainnet,
  bitLayerTestnet,
  bitLayerMainnet,
  merlinTestnet,
  merlinMainnet
] as Chain[]

export const chainsTitle: { [key: string]: string } = {
  [suiTestnet.id]: 'Sui',
  [suiMainnet.id]: 'Sui',
  [bitLayerTestnet.id]: 'BitLayer',
  [bitLayerMainnet.id]: 'BitLayer',
  [merlinMainnet.id]: 'Merlin',
  [merlinTestnet.id]: 'Merlin'
} as const

export const getSuiChainId = () =>
  isProduction() ? suiMainnet.id : suiTestnet.id
