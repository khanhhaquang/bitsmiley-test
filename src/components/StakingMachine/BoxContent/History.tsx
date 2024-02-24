import { ArrowLeftIcon, BitJade } from '@/assets/icons'

type HistoryProps = {
  onBackClick: () => void
}
export const History: React.FC<HistoryProps> = ({ onBackClick }) => {
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
                Inscription ID
              </th>
              <th align="left" className="pb-3">
                Staking period
              </th>
              <th align="left" className="pb-3">
                Rewards
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-psm">
              <td className="pt-3">JSO...DJAO</td>
              <td className="pt-3">04.02.2024 - 04.03.2024</td>
              <td className="pt-3 text-cyan">50</td>
            </tr>

            <tr className="font-psm">
              <td className="pt-3">JSO...DJAO</td>
              <td className="pt-3">04.02.2024 - 04.03.2024</td>
              <td className="pt-3 text-cyan">50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
