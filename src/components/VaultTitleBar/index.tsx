import './index.scss'
import { formatAmountThousands } from '@/utils/formatter'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

export const VaultTitleBar: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any
}> = ({ list }) => {
  console.log(list)
  if (!list) return null
  const items = [
    {
      name: 'Borrow rate',
      value: `${(list?.borrowRate as number) * 100} %`
    },
    {
      name: 'Liquidation Penalty',
      value: `${(list?.liquidationPenalty as number) * 100} %`
    },
    {
      name: 'Vault Floor',
      value: `${formatAmountThousands(
        (list?.vaultFloor || 0).toString(),
        4
      )} bitUSD`
    },
    {
      name: 'Vault Ceiling',
      value: `${formatAmountThousands(
        (list?.vaultCeiling || 0).toString(),
        4
      )} bitUSD`
    },
    {
      name: 'Max LTV',
      value: `${(list?.maxLTV as number) * 100} %`
    }
  ]
  const renderedItems = items.map((item, index) => (
    <li key={index} className="mr-[40px] text-center">
      {item.name}: {item.value}
      <Tooltip>
        <TooltipTrigger>
          <span> ⓘ</span>
        </TooltipTrigger>
        <TooltipContent></TooltipContent>
      </Tooltip>
    </li>
  ))
  return (
    <>
      <ul className="flex justify-center font-ibmr text-white">
        {renderedItems}
      </ul>
    </>
  )
}
