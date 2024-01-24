import { AsteriskIcon, CrownYellowIcon, StarIcon } from '@/assets/icons'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { displayAddress } from '@/utils/formatter'

export const NotInscribed: React.FC = () => {
  const { isDuringWhitelist } = useProjectInfo()
  const { address, isWhitelist } = useUserInfo()

  const renderWhitelistContent = () => {
    return (
      <>
        <div className="absolute left-[555px] top-[342px] flex items-center gap-x-2 font-smb">
          <StarIcon />
          <StarIcon />
          <span>CONGRATULATIONS</span>
          <StarIcon />
          <StarIcon />
        </div>
        <div className="absolute left-[477px] top-[401px] flex w-[438px] flex-col items-center gap-y-6">
          <CrownYellowIcon className="h-[75px] w-[93px]" />
          <div className="text-center text-sm leading-tight">
            You are one of the few chosen ones. Hit the MINTING button below to
            get your secret pass!
          </div>
        </div>
      </>
    )
  }

  const renderNormalContent = () => {
    return (
      <>
        <div className="absolute left-[498px] top-[345px] flex items-center gap-x-[5px]">
          <AsteriskIcon />
          <span className="font-smb text-sm">----- Dear BitSmiler -----</span>
          <AsteriskIcon />
        </div>

        <div className="absolute left-[490px] top-[439px] w-[412px] text-center text-sm leading-tight">
          Public minting is here, First come first serve. Every wallet has one
          chance. Hit the MINTING button below to get your secret pass!
        </div>
      </>
    )
  }

  return (
    <>
      <div className="absolute left-[336px] top-[318px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>{displayAddress(address, 3, 3)}</div>
      </div>

      {isWhitelist && isDuringWhitelist
        ? renderWhitelistContent()
        : renderNormalContent()}
    </>
  )
}
