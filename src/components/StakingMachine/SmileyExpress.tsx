import { Image } from '@/components/Image'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Divider } from '@/pages/Main/StakingPage'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { BuyButton, BuyFromType } from './BuyButton'

const BuySmile: React.FC = () => {
  const { isMobile } = useMediaQuery()
  return (
    <div
      className={cn(
        isMobile
          ? 'flex flex-wrap gap-2 w-full items-center justify-center'
          : 'flex gap-1'
      )}>
      <BuyButton from={BuyFromType.BYBIT} />
      <BuyButton from={BuyFromType.GateIo} />
      <BuyButton from={BuyFromType.MEXC} />
      <BuyButton from={BuyFromType.Bitget} />
      <BuyButton from={BuyFromType.KUCOIN} />
    </div>
  )
}

export const SmileyExpress: React.FC = () => {
  const { isMobile } = useMediaQuery()
  if (isMobile)
    return (
      <div className="absolute z-10 flex flex-col items-center gap-y-3 pt-8 font-psm">
        <div className="flex h-[280px] w-[384px] flex-col">
          <Image
            className="shrink-0"
            src={getIllustrationUrl('mobile-enter-title', 'webp')}
          />
          <Image
            className="mb-[70px] h-[94px] w-[384px]"
            src={getIllustrationUrl('mobile-bg-top', 'webp')}
          />
          <Image
            className="h-[94px] w-[384px]"
            src={getIllustrationUrl('mobile-bg-bottom', 'webp')}
          />
          <Image
            className="absolute -left-[40px] top-[28px] h-[200px] w-[286px]"
            src={getIllustrationUrl('light-left', 'gif')}
          />
          <Image
            className="absolute -right-[230px] top-[28px] h-[200px] w-[286px]"
            src={getIllustrationUrl('light-right', 'gif')}
          />
          <div className="absolute top-[170px] flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <Image
                src={getIllustrationUrl('red-lines', 'webp')}
                className="h-[9px] w-[50px]"
              />
              <div className="text-xs text-[#FF64AE]">
                THE No.1 Stablecoin PROTOCOL in BTC
              </div>
              <Image
                src={getIllustrationUrl('red-lines', 'webp')}
                className="h-[9px] w-[50px]"
              />
            </div>
            <div className="flex items-center gap-4">
              <Image
                src={getIllustrationUrl('white-smile-icon', 'webp')}
                className="h-[56px] w-[52px]"
              />
              <div className="font-smb2 text-[50px] leading-none text-white [text-shadow:_6px_0px_0px_#5B5B5B]">
                $SMILE
              </div>
            </div>
          </div>
        </div>

        <Divider title="Buy $SMILE from" className="relative my-0"></Divider>
        <BuySmile></BuySmile>
      </div>
    )
  return (
    <div className="absolute left-[293px] top-[300px] z-10">
      <div className="relative flex w-[810px] flex-col items-center gap-y-3 pt-8 font-psm">
        <div className="flex items-center gap-3">
          <Image
            src={getIllustrationUrl('red-lines', 'webp')}
            className="h-[20px] w-[130px]"
          />
          <div className="text-2xl text-[#FF64AE]">
            THE No.1 Stablecoin PROTOCOL in BTC
          </div>
          <Image
            src={getIllustrationUrl('red-lines', 'webp')}
            className="h-[20px] w-[130px]"
          />
        </div>
        <div className="flex items-center gap-3">
          <Image
            src={getIllustrationUrl('white-smile-icon', 'webp')}
            className="h-[93px] w-[86px]"
          />
          <div className="font-smb2 text-[80px] leading-[110px] text-white [text-shadow:_6px_0px_0px_#5B5B5B]">
            $SMILE
          </div>
        </div>
        <div className="flex w-full items-center gap-3">
          <Image
            src={getIllustrationUrl('dash-line', 'webp')}
            className="h-[1px] w-[306px]"
          />
          <div className="text-white">Buy $SMILE from</div>
          <Image
            src={getIllustrationUrl('dash-line', 'webp')}
            className="h-[1px] w-[306px]"
          />
        </div>
        <BuySmile></BuySmile>
      </div>
    </div>
  )
}
