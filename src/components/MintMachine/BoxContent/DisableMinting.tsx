import { useUserInfo } from '@/hooks/useUserInfo'
import { displayAddress } from '@/utils/formatter'

export const DisableMinting: React.FC = () => {
  const { address } = useUserInfo()

  return (
    <>
      <div className="absolute left-[336px] top-[318px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>{displayAddress(address, 3, 3)}</div>
      </div>

      <div className="absolute left-[668px] top-[431px] font-smb text-sm">
        ohhh...
      </div>

      <div className="absolute left-[468px] top-[467px] w-[456px] text-center text-sm">
        Something went wrong during the minting process.
      </div>
    </>
  )
}
