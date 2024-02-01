import { AsteriskIcon, StarIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { displayAddress } from '@/utils/formatter'

export const DearBitSmiler: React.FC = () => {
  return (
    <div className="absolute bottom-[624px] left-1/2 flex -translate-x-1/2 items-center gap-x-[5px]">
      <AsteriskIcon />
      <span className="font-smb text-sm">--- Dear BitSmiler ---</span>
      <AsteriskIcon />
    </div>
  )
}

export const PlayerInfo: React.FC = () => {
  const { address } = useUserInfo()

  if (!address) return null

  return (
    <>
      <div className="absolute bottom-[624px] left-[336px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>{displayAddress(address, 3, 3)}</div>
      </div>
    </>
  )
}

export const Congradulation: React.FC = () => {
  return (
    <div className="absolute bottom-[624px] left-1/2 flex -translate-x-1/2 items-center gap-x-2 font-smb">
      <StarIcon />
      <StarIcon />
      <span>CONGRATULATIONS</span>
      <StarIcon />
      <StarIcon />
    </div>
  )
}
