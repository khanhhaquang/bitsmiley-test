import { ArrowLeftIcon, BitJade } from '@/assets/icons'
import { useUserStakes } from '@/hooks/useUserStakes'

type HistoryProps = {
  onBackClick: () => void
}
export const History: React.FC<HistoryProps> = ({ onBackClick }) => {
  const { stakeRewards, jadeBalance } = useUserStakes()

  return (
    <div className="flex w-[612px] flex-col gap-y-11 pt-8">
      <div className="flex items-center justify-between font-smb">
        <button
          className="flex shrink-0 cursor-pointer items-baseline gap-2 text-sm hover:underline"
          onClick={() => onBackClick()}>
          <ArrowLeftIcon width={11} height={12} />
          Back
        </button>
        <h2 className="font-smb text-sm">Staking history</h2>
        <p className="flex gap-1 font-psm text-sm text-cyan">
          <BitJade width={15} height={20} />x{jadeBalance}
        </p>
      </div>
      <div className="flex w-full flex-col">
        <table className="w-full">
          <thead className="table w-full table-fixed pr-1">
            <tr className="mb-3 table w-[calc(100%_-_5px)] table-fixed border-b border-dashed border-blue font-psm text-blue">
              <th align="left" style={{ width: '33%' }} className="pb-3">
                Token ID
              </th>
              <th align="left" style={{ width: '50%' }} className="pb-3">
                Staked at Block
              </th>
              <th align="left" style={{ width: '17%' }} className="pb-3 pr-1">
                Rewards
              </th>
            </tr>
          </thead>
          <tbody className="block h-[140px] w-full table-fixed overflow-y-auto">
            {stakeRewards?.map((stake) => (
              <tr
                className="table w-full table-fixed font-psm"
                key={Number(stake.tokenId)}>
                <td className="pb-3" align="left" style={{ width: '33%' }}>
                  {Number(stake.tokenId)}
                </td>
                <td className="pb-3" align="left" style={{ width: '50%' }}>
                  {Number(stake.stakedTime)}
                </td>
                <td
                  className="pb-3 text-cyan"
                  align="left"
                  style={{ width: '17%' }}>
                  {Number(stake.reward)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
