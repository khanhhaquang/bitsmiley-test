import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const chainsIconUrl: { [key: string]: string } = {
  4200: getIllustrationUrl('merlin-chain-logo', 'webp'),
  686868: getIllustrationUrl('merlin-chain-logo', 'webp'),
  111: getIllustrationUrl('bob-chain-logo', 'webp'),
  1102: getIllustrationUrl('bsquared-chain-logo', 'webp'),
  3636: getIllustrationUrl('botanix-chain-logo', 'webp')
} as const
