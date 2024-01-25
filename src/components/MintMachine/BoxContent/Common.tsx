import { AsteriskIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { displayAddress } from '@/utils/formatter'

export const DearBitSmiler: React.FC = () => {
  return (
    <div className="absolute left-[526px] top-[345px] flex items-center gap-x-[5px]">
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
    <div className="absolute left-[336px] top-[325px] flex flex-col gap-y-1.5 font-smb text-sm">
      <div>PLAYER:</div>
      <div>{displayAddress(address, 3, 3)}</div>
    </div>
  )
}
