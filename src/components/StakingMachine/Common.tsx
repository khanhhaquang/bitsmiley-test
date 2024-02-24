import { AsteriskIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'
import { displayAddress } from '@/utils/formatter'

export const DearBitSmiler: React.FC = () => {
  return (
    <div className="mx-auto flex items-center gap-x-[5px]">
      <AsteriskIcon />
      <span className="font-smb text-sm">------ Dear BitSmiler ------</span>
      <AsteriskIcon />
    </div>
  )
}

export const PlayerInfo: React.FC<{ className?: string }> = ({ className }) => {
  const { address } = useUserInfo()

  if (!address) return null

  return (
    <div className={cn('flex flex-col gap-y-1.5 font-smb text-sm', className)}>
      <div>bitSmiler:</div>
      <div>{displayAddress(address, 3, 3)}</div>
    </div>
  )
}
