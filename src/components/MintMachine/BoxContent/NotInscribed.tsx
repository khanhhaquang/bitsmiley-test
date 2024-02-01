import { CrownYellowIcon } from '@/assets/icons'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { Congradulation, DearBitSmiler, PlayerInfo } from './Common'

export const NotInscribed: React.FC = () => {
  const { isWhitelist } = useUserInfo()
  const { isDuringWhitelist } = useProjectInfo()

  const renderWhitelistContent = () => {
    return (
      <>
        <Congradulation />
        <div className="absolute left-1/2 top-[401px] flex w-[438px] -translate-x-1/2 flex-col items-center gap-y-6">
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
        <DearBitSmiler />

        <div className="absolute left-1/2 top-[439px] w-[412px] -translate-x-1/2 text-center text-sm leading-tight">
          Public minting is here, First come first serve. Every wallet has one
          chance. Hit the MINTING button below to get your secret pass!
        </div>
      </>
    )
  }

  return (
    <>
      <PlayerInfo />

      {isWhitelist && isDuringWhitelist
        ? renderWhitelistContent()
        : renderNormalContent()}
    </>
  )
}
