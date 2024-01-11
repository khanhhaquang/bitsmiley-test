import { CrownIcon, StarIcon } from '@/assets/icons'

export const RolledDiceOpenedAndWon: React.FC = () => {
  return (
    <>
      <div className="absolute left-[336px] top-[318px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>39s...sda</div>
      </div>

      <div className="absolute left-[555px] top-[335px] flex items-center gap-x-2 font-smb">
        <StarIcon />
        <StarIcon />
        <span>CONGRATULATIONS</span>
        <StarIcon />
        <StarIcon />
      </div>

      <div className="absolute left-[424px] top-[397px] flex w-[545px] flex-col items-center gap-y-6">
        <CrownIcon />
        <div className="text-center text-sm leading-tight">
          You have won a bitSmiley card. You are now one of the bitSmiler
          family.Hit the MINT button to reveal your secret pass!
        </div>
      </div>
    </>
  )
}
