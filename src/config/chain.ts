import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import {
  bitLayerMainnet,
  bitLayerTestnet,
  bobTestnet,
  botanixTestnet,
  bSquaredTestnet,
  merlinMainnet,
  merlinTestnet,
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
  [zetaMainnet.id]: getIllustrationUrl('zeta-chain-logo', 'webp')
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
