import { Image } from '@/components/Image'
import { AsteriskIcon, GoldCoinIcon } from '@/assets/icons'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { cn } from '@/utils/cn'

export const GoldConnectedAndNotPayed: React.FC = () => {
  return (
    <>
      <div className="absolute left-[356px] top-[360px] w-[464px]">
        <div className="mb-9 flex items-center justify-between px-7">
          <AsteriskIcon />
          <div className="font-smb text-sm">
            ---- Dear BitSmiler{' '}
            <span className="bg-gold-og bg-clip-text text-transparent">OG</span>{' '}
            ----
          </div>
          <AsteriskIcon />
        </div>

        <div className="flex items-start gap-x-10">
          <Image
            src={getIllustrationUrl('gold-card')}
            className="h-[94px] w-[146px]"
          />
          <div className="text-sm leading-tight">
            You are the true OG of BTC, formidable and respectable. For a little
            teaser, you are granted chance to buy a{' '}
            <span className="text-yellow2">bitGem gold</span>, guaranteed win in
            the later luck draw.
          </div>
        </div>
      </div>

      <div className="absolute left-[876px] top-[360px] flex flex-col items-center">
        <Image
          src={getIllustrationUrl('gold-bitgem')}
          className="mb-6 h-[134px] w-[146px]"
        />
        <div className="mb-1.5 flex items-center gap-x-1">
          <span className="font-smb text-[10px] text-yellow3">0.043 BTC</span>
          <GoldCoinIcon />
        </div>

        <div
          className={cn(
            'relative bg-white cursor-pointer text-black px-3 py-1 font-bold whitespace-nowrap text-[15px] hover:bg-blue3',
            'shadow-connectwallet-button hover:shadow-connectwallet-button-hover active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue'
          )}>
          PURCHASE
        </div>
      </div>
    </>
  )
}
