import { AsteriskIcon, GoldCoinIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const NormalConnectedAndNotPayed: React.FC = () => {
  return (
    <>
      <div className="absolute left-[395px] top-[360px] w-[389px]">
        <div className="mb-10 flex w-full items-center justify-between gap-x-[5px] whitespace-nowrap">
          <AsteriskIcon className="shrink-0" />
          <div className="font-smb text-sm">---- Dear BitSmiler ----</div>
          <AsteriskIcon className="shrink-0" />
        </div>

        <div className="mb-5 text-sm leading-tight">
          Buy <span className="text-green2">bitGem</span>, win big! Run this
          minting machine with <span className="text-green2">bitGem</span>
          and enter luck draw to win 1 of the 1500 exclusive bitSmiley cards.
          Max 2 <span className="text-green2">bitGem</span> each wallet.
        </div>

        <div className="text-sm leading-tight">
          <span className="text-pink">P.S.</span> Don’t worry, if you didn’t win
          anything, we will refund your bitGem money.
        </div>
      </div>

      <div className="absolute left-[876px] top-[360px] flex flex-col items-center">
        <Image
          src={getIllustrationUrl('normal-bitgem')}
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
