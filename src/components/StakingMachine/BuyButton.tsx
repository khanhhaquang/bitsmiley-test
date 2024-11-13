import { Image } from '@/components/Image'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'
import { getIllustrationUrl, openUrl } from '@/utils/getAssetsUrl'
export enum BuyFromType {
  BYBIT,
  GateIo,
  MEXC,
  Bitget,
  KUCOIN
}

const BuyFromAttr: Record<BuyFromType, [string, string]> = {
  [BuyFromType.BYBIT]: [
    'bybit-icon',
    'https://www.bybit.com/en/trade/spot/SMILE/USDT'
  ],
  [BuyFromType.GateIo]: [
    'gate-io-icon',
    'https://www.gate.io/trade/SMILE_USDT'
  ],
  [BuyFromType.MEXC]: ['mexc-icon', 'https://www.mexc.com/exchange/SMILE_USDT'],
  [BuyFromType.Bitget]: [
    'bitget-icon',
    'https://www.bitget.com/spot/SMILEUSDT'
  ],
  [BuyFromType.KUCOIN]: [
    'kucoin-icon',
    'https://www.kucoin.com/trade/SMILE-USDT'
  ]
}

type BuyButtonProps = {
  from: BuyFromType
}

export const BuyButton: React.FC<BuyButtonProps> = ({ from }) => {
  const { isMobile } = useMediaQuery()
  const [image, url] = BuyFromAttr[`${from}`]
  return (
    <button
      type="button"
      className={cn(
        isMobile ? 'w-[158px] h-[51px]' : 'w-[144px] h-[47px]',
        'group relative cursor-pointer',
        'disabled:cursor-not-allowed disabled:saturate-50'
      )}
      onClick={() => openUrl(url)}>
      <span className="relative z-10 flex h-full items-center justify-center">
        <Image src={getIllustrationUrl(image, 'webp')} />
      </span>
      <img
        className={cn('absolute inset-0 size-full block group-hover:hidden')}
        alt="button bg"
        src={getIllustrationUrl(`buy-button-bg`, 'webp')}
      />
      <img
        className={cn('absolute inset-0 size-full hidden group-hover:block')}
        alt="button bg"
        src={getIllustrationUrl(`buy-button-hover-bg`, 'webp')}
      />
    </button>
  )
}
