import { OvalCoinBlueIcon } from '@/assets/icons'

export const NormalPayedButMintingNotStarted: React.FC = () => {
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
            <OvalCoinBlueIcon />
          </div>
        </div>
      </div>

      <div className="absolute left-[472px] top-[413px] w-[448px]">
        <div className="mb-[42px] text-center text-sm leading-tight">
          Congratulations! You have now chances to win the lucrative bitSmiley
          card. Come back shortly for the grand minting!
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-y-4 font-smb">
          <div className="text-sm">GRAND MINTING IN</div>
          <div className="text-2xl text-green">12H:20M:24S</div>
        </div>
      </div>
    </>
  )
}
