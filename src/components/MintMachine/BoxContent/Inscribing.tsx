import { CrownIcon, StarIcon } from '@/assets/icons'

export const Inscribing: React.FC = () => {
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

      <div className="absolute left-[437px] top-[397px] flex w-[519px] flex-col items-center gap-y-6">
        <CrownIcon />
        <div className="text-center text-sm leading-tight">
          We have prepared your exclusive bitSmiley card for you! Hit the MINT
          button below to reveal your secret pass.
        </div>
      </div>
    </>
  )
}
