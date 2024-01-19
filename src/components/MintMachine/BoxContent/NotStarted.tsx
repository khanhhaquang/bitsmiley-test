import { AsteriskIcon, CrownYellowIcon, StarIcon } from '@/assets/icons'
import { useCountdown } from '@/hooks/useCountdown'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { displayAddress } from '@/utils/formatter'
import { useMemo } from 'react'

export const NotStarted: React.FC = () => {
  const { whitelistRemainTime, normalRemainTime } = useProjectInfo()
  const { address, isWhitelist } = useUserInfo()

  const [count] = useCountdown({
    countStart: isWhitelist ? whitelistRemainTime : normalRemainTime
  })

  const counterLabel = useMemo(() => {
    const padNum = (n: number) => n.toString().padStart(2, '0')

    const days = Math.floor(count / 86400)
    const hours = Math.floor((count % 86400) / 3600)
    const minutes = Math.floor(((count % 86400) % 3600) / 60)
    const seconds = ((count % 86400) % 3600) % 60

    if (days) return `${padNum(days)}d:${padNum(hours)}h:${padNum(minutes)}m`
    return `${padNum(hours)}h:${padNum(minutes)}m:${padNum(seconds)}s`
  }, [count])

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
        <div className="absolute left-[498px] top-[345px] flex items-center gap-x-[5px]">
          <AsteriskIcon />
          <span className="font-smb text-sm">----- Dear BitSmiler -----</span>
          <AsteriskIcon />
        </div>

        <div className="absolute left-[562px] top-[439px] text-sm">
          Keep an eye on the ticking clock
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

      {isWhitelist ? renderWhitelistContent() : renderNormalContent()}

      <div className="absolute left-[584px] top-[528px] font-smb text-sm uppercase">
        grand minting in
      </div>

      <div className="absolute left-[564px] top-[558px] font-smb text-2xl uppercase text-green">
        {counterLabel}
      </div>
    </>
  )
}