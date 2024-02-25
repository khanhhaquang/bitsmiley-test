import { ArrowLeftIcon, BitJade } from '@/assets/icons'
import { useReadStakingContractGetStakeRewards } from '@/contracts/Staking'
import { useUserInfo } from '@/hooks/useUserInfo'

type HistoryProps = {
  onBackClick: () => void
}
export const History: React.FC<HistoryProps> = ({ onBackClick }) => {
  const { address } = useUserInfo()
  const { data: stakes } = useReadStakingContractGetStakeRewards({
    args: [address]
  })

  return (
    <div className="flex w-[612px] flex-col gap-y-11 pt-8">
      <div className="flex items-center justify-between font-smb">
        <button
          className="flex shrink-0 items-baseline gap-2 text-sm hover:underline"
          onClick={() => onBackClick()}>
          <ArrowLeftIcon width={11} height={12} />
          Back
        </button>
        <h2 className="font-smb text-sm">Staking history</h2>
        <p className="flex gap-1 font-psm text-sm text-cyan">
          <BitJade width={15} height={20} />
          x245
        </p>
      </div>
      <div className="flex flex-col">
        <table>
          <thead>
            <tr className="border-b border-dashed border-blue font-psm text-blue">
              <th align="left" className="pb-3">
                Token ID
              </th>
              <th align="left" className="pb-3">
                Staked Since
              </th>
              <th align="left" className="pb-3">
                Rewards
              </th>
            </tr>
          </thead>
          <tbody>
            {stakes?.map((stake) => (
              <tr className="font-psm" key={Number(stake.tokenId)}>
                <td className="pt-3">{Number(stake.tokenId)}</td>
                <td className="pt-3">{Number(stake.stakedTime)}</td>
                <td className="pt-3 text-cyan">{Number(stake.reward)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
