import { CrownYellowIcon } from '@/assets/icons'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { Congradulation, DearBitSmiler, PlayerInfo } from './Common'

export const NotStarted: React.FC = () => {
  const { isWhitelist } = useUserInfo()
  const { remainBlock, isWhitelistEnded, isReachWhitelistMaximum } =
    useProjectInfo()

  const renderWhitelistContent = () => {
    if (isWhitelistEnded) {
      return (
        <>
          <div className="absolute bottom-[624px] left-1/2 -translate-x-1/2 font-smb text-sm">
            whitelist minting finished
          </div>
          <div className="absolute left-1/2 top-[410px] w-[438px] -translate-x-1/2 text-center text-sm">
            Dear whitelisted player, you are a bit late. The whitelist minting
            session is over. You can still join the public session!
          </div>
        </>
      )
    }

    if (isReachWhitelistMaximum) {
      return (
        <>
          <div className="absolute bottom-[624px] left-1/2 -translate-x-1/2 font-smb text-sm">
            whitelist minting finished
          </div>
          <div className="absolute left-1/2 top-[410px] w-[438px] -translate-x-1/2 text-center text-sm">
            Dear whitelisted player, you are a bit late. All the whitelist
            bitDisc Black have been minted. You can still join the public
            session!
          </div>
        </>
      )
    }

    return (
      <>
        <Congradulation />

        <div className="absolute left-1/2 top-[384px] flex w-[438px] -translate-x-1/2 flex-col items-center gap-y-4">
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

        <div className="absolute left-1/2 top-[410px] w-[438px] -translate-x-1/2 text-center text-sm">
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
