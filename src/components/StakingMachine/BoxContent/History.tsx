import { ArrowLeftIcon, BitJade } from '@/assets/icons'
import { useReadStakingContractGetStakeRewards } from '@/contracts/Staking'
import useContractAddresses from '@/hooks/useNetworkAddresses'
import { useUserInfo } from '@/hooks/useUserInfo'

type HistoryProps = {
  onBackClick: () => void
}
export const History: React.FC<HistoryProps> = ({ onBackClick }) => {
  const { address } = useUserInfo()
  const contractAddresses = useContractAddresses()
  const { data: stakes } = useReadStakingContractGetStakeRewards({
    address: contractAddresses?.staking,
    args: [address]
  })

  const total = stakes?.reduce(
    (pre, cur) => (pre += Number(cur.reward || 0)),
    0
  )

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
          <BitJade width={15} height={20} />x{total}
        </p>
      </div>
      <div className="flex w-full flex-col">
        <table className="w-full">
          <thead className="table w-full table-fixed">
            <tr className="table w-full table-fixed border-b border-dashed border-blue font-psm text-blue">
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
          <tbody className="block h-[140px] w-full table-fixed overflow-y-auto">
            {stakes?.map((stake) => (
              <tr
                className="table w-full table-fixed font-psm"
                key={Number(stake.tokenId)}>
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
