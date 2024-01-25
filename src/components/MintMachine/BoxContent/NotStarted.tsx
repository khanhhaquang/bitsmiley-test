import { CrownYellowIcon, StarIcon } from '@/assets/icons'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { DearBitSmiler, PlayerInfo } from './Common'

export const NotStarted: React.FC = () => {
  const { isWhitelist } = useUserInfo()
  const { remainBlock, isWhitelistEnded, isReachWhitelistMaximum } =
    useProjectInfo()

  const renderWhitelistContent = () => {
    if (isWhitelistEnded) {
      return (
        <>
          <div className="absolute left-[514px] top-[350px] font-smb text-sm">
            whitelist minting finished
          </div>
          <div className="absolute left-[477px] top-[410px] w-[438px] text-center text-sm">
            Dear whitelisted player, you are a bit late. The whitelist minting
            session is over. You can still join the public session!
          </div>
        </>
      )
    }

    if (isReachWhitelistMaximum) {
      return (
        <>
          <div className="absolute left-[514px] top-[350px] font-smb text-sm">
            whitelist minting finished
          </div>
          <div className="absolute left-[477px] top-[410px] w-[438px] text-center text-sm">
            Dear whitelisted player, you are a bit late. All the whitelist
            bitDisc Black have been minted. You can still join the public
            session!
          </div>
        </>
      )
    }

    return (
      <>
        <div className="absolute left-[555px] top-[350px] flex items-center gap-x-2 font-smb">
          <StarIcon />
          <StarIcon />
          <span>CONGRATULATIONS</span>
          <StarIcon />
          <StarIcon />
        </div>

        <div className="absolute left-[477px] top-[384px] flex w-[438px] flex-col items-center gap-y-4">
          <CrownYellowIcon />
          <div className="text-center text-sm leading-tight">
            You are one of the few chosen ones. Minting session for whitelisted
            bitSmilers will start soon
          </div>
        </div>
      </>
    )
  }

  const renderNormalContent = () => {
    return (
      <>
        <DearBitSmiler />

        <div className="absolute left-[477px] top-[410px] w-[438px] text-center text-sm">
          The public minting session for bitDisc Black is coming. Keep an eye on
          the ticking clock. Every wallet has one chance to win!
        </div>
      </>
    )
  }

  return (
    <>
      <PlayerInfo />

      {isWhitelist ? renderWhitelistContent() : renderNormalContent()}

      <div className="absolute left-[556px] top-[516px] flex flex-col items-center gap-y-3 font-smb">
        <div className="text-2xl uppercase text-green">
          {remainBlock} BLOCKS
        </div>
        <div className="text-sm uppercase">until minting starts</div>
      </div>
    </>
  )
}
