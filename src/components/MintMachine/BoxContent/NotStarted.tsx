import { useCountdown } from '@/hooks/useCountdown'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { getAccountInfo } from '@/store/account/reducer'
import { displayAddress } from '@/utils/formatter'
import { useSelector } from 'react-redux'

export const NotStarted: React.FC = () => {
  const { remainTime } = useProjectInfo()
  const { address } = useSelector(getAccountInfo)

  const [count] = useCountdown({
    countStart: remainTime
  })

  const days = Math.floor(count / 86400)
  const hours = Math.floor((count % 86400) / 3600)
  const minutes = Math.floor(((count % 86400) % 3600) / 60)
  const seconds = ((count % 86400) % 3600) % 60

  return (
    <>
      <div className="absolute left-[336px] top-[318px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>{displayAddress(address, 3, 3)}</div>
      </div>

      <div className="absolute left-[472px] top-[413px] flex w-[448px] flex-col items-center text-sm">
        <div className="mb-[42px] text-center">
          Congratulations! You have now chances to win the lucrative bitSmiley
          card. Come back shortly for the grand minting!
        </div>

        <div className="mb-3 font-smb uppercase">grand minting in</div>

        <div className="font-smb text-2xl uppercase text-green">
          {`${days}d:${hours}h:${minutes}m:${seconds}s`}
        </div>
      </div>
    </>
  )
}
