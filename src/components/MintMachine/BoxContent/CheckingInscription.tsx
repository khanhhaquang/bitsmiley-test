import { useUserInfo } from '@/hooks/useUserInfo'
import { displayAddress } from '@/utils/formatter'

export const CheckingInscription: React.FC = () => {
  const { address } = useUserInfo()

  return (
    <>
      <div className="absolute left-[336px] top-[318px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>{displayAddress(address, 3, 3)}</div>
      </div>
      <div className="absolute left-[568px] top-[444px] z-[100] text-sm">
        Checking inscriptions on-chain...
      </div>
    </>
  )
}
