import { OvalCoinGreyIcon } from '@/assets/icons'
import { MEDIA } from '@/config/links'

export const SecondRolledDiceOpenedAndFailed: React.FC = () => {
  return (
    <>
      <div className="absolute left-[336px] top-[325px] flex w-[720px] items-center justify-between font-smb text-sm">
        <div className="flex flex-col items-start gap-y-1.5">
          <div>Player:</div>
          <div>39s...sda</div>
        </div>
        <div className="flex flex-col items-end gap-y-1.5">
          <div>BITGEM GOLD</div>
          <div className="flex items-center gap-x-1">
            <OvalCoinGreyIcon />
            <OvalCoinGreyIcon />
          </div>
        </div>
      </div>

      <div className="absolute left-[468px] top-[402] w-[456px]">
        <div className="mb-6 text-center font-smb text-sm">ohhh...</div>
        <div className="text-center text-sm leading-tight">
          We are so sorry, you have missed the chance to be one of the Smiler OG
          club. We will refund your bitGem cost to your wallet address. Stay
          tuned with us on
        </div>
        <div
          className="cursor-pointer text-center text-sm text-green"
          onClick={() => window.open(MEDIA.twitter, '__blank')}>
          [<span className="hover:underline">Twitter</span>]
        </div>
      </div>
    </>
  )
}
