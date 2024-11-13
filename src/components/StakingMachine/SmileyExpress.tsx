import { Image } from '@/components/Image'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Divider } from '@/pages/Main/StakingPage'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { BuyButton } from './BuyButton'

const BuySmile: React.FC = () => {
  const { isMobile } = useMediaQuery()
  return (
    <div
      className={cn(
        isMobile
          ? 'flex flex-wrap gap-2 w-full items-center justify-center'
          : 'flex gap-1'
      )}>
      <BuyButton>
        <Image
          src={getIllustrationUrl('bybit-icon', 'webp')}
          className="h-[31px] w-[83px]"
        />
      </BuyButton>
      <BuyButton>
        <Image
          src={getIllustrationUrl('gate-io-icon', 'webp')}
          className="h-[26px] w-[93px]"
        />
      </BuyButton>
      <BuyButton>
        <Image
          src={getIllustrationUrl('mexc-icon', 'webp')}
          className="h-[17px] w-[91px]"
        />
      </BuyButton>
      <BuyButton>
        <Image
          src={getIllustrationUrl('bitget-icon', 'webp')}
          className="h-[26px] w-[85px]"
        />
      </BuyButton>
      <BuyButton>
        <Image
          src={getIllustrationUrl('kucoin-icon', 'webp')}
          className="h-[31px] w-[112px]"
        />
      </BuyButton>
    </div>
  )
}

export const SmileyExpress: React.FC = () => {
  const { isMobile } = useMediaQuery()
  if (isMobile)
    return (
      <div className="relative flex flex-col items-center gap-y-3 pt-8 font-psm">
        <div className="flex items-center gap-3">
          <Image
            src={getIllustrationUrl('red-lines', 'webp')}
            className="h-[9px] w-[55px]"
          />
          <div className="text-xs text-[#FF64AE]">
            THE No.1 Stablecoin PROTOCOL in BTC
          </div>
          <Image
            src={getIllustrationUrl('red-lines', 'webp')}
            className="h-[9px] w-[55px]"
          />
        </div>
        <div className="flex items-center gap-4">
          <Image
            src={getIllustrationUrl('white-smile-icon', 'webp')}
            className="h-[56px] w-[52px]"
          />
          <div className="font-smb2 text-[40px] leading-none text-white [text-shadow:_6px_0px_0px_#5B5B5B]">
            $SMILE
          </div>
        </div>
        <Divider title="buy smile from" className="relative my-0"></Divider>
        {/* <div>buy smile from</div> */}
        <BuySmile></BuySmile>
      </div>
    )
  return (
    <div className="absolute left-[300px] top-[300px] z-10">
      <div className="relative flex w-[800px] flex-col items-center gap-y-3 pt-8 font-psm">
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
