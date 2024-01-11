import { OvalCoinBlueIcon, OvalCoinGreyIcon } from '@/assets/icons'

export const FirstRolledDiceOpenedAndFailed: React.FC = () => {
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
            <OvalCoinBlueIcon />
            <OvalCoinGreyIcon />
          </div>
        </div>
      </div>

      <div className="absolute left-[668px] top-[431px] font-smb text-sm">
        ohhh...
      </div>

      <div className="absolute left-[468px] top-[467px] w-[456px] text-center text-sm leading-tight">
        Unfortunately, you didn’t win the Smiley Express card in this run. Try
        your luck again?
      </div>
    </>
  )
}
