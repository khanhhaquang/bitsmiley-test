import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { AsteriskIcon, GoldCoinIcon } from '@/assets/icons'

export const WhitelistConnectedAndNotPayed: React.FC = () => {
  return (
    <>
      <div className="absolute left-[356px] top-[360px] w-[357px]">
        <div className="mb-9 flex w-full items-center justify-between gap-x-[5px] whitespace-nowrap">
          <AsteriskIcon className="shrink-0" />
          <div className="font-smb text-sm">---- Dear BitSmiler ----</div>
          <AsteriskIcon className="shrink-0" />
        </div>

        <div className="text-sm leading-tight">
          You are the chosen one. Unlike others, with{' '}
          <span className="text-yellow2">bitGem gold</span>, you are guaranteed
          to win the lucky draw of bitSmiley card! Purchase it now and secure
          your position.
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
