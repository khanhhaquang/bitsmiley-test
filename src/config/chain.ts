import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import {
  bobTestnet,
  botanixTestnet,
  bSquaredTestnet,
  merlinMainnet,
  merlinTestnet
} from './wagmi'

export const chainsIconUrl: { [key: string]: string } = {
  [merlinMainnet.id]: getIllustrationUrl('merlin-chain-logo', 'webp'),
  [merlinTestnet.id]: getIllustrationUrl('merlin-chain-logo', 'webp'),
  [bobTestnet.id]: getIllustrationUrl('bob-chain-logo', 'webp'),
  [bSquaredTestnet.id]: getIllustrationUrl('bsquared-chain-logo', 'webp'),
  [botanixTestnet.id]: getIllustrationUrl('botanix-chain-logo', 'webp')
} as const
