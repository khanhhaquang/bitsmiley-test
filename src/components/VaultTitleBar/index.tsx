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
      name: 'Stability Fee',
      value: `${(list?.borrowRate as number) * 100} % `,
      tooltipMsg: `The annual Stability Fee for vaults, calculated based on your
      outstanding vault debt.`
    },
    {
      name: 'Liquidation Penalty',
      value: `${(list?.liquidationPenalty as number) * 100} % `,
      tooltipMsg: ``
    },
    {
      name: 'Vault Floor',
      value: `${formatAmountThousands(
        (list?.vaultFloor || 0).toString(),
        4
      )} bitUSD `,
      tooltipMsg: `Minimum amount of bitUSD required to be minted from a Vault`
    },
    {
      name: 'Vault Ceiling',
      value: `${formatAmountThousands(
        (list?.vaultCeiling || 0).toString(),
        4
      )} bitUSD `,
      tooltipMsg: `Maximum amount of bitUSD that can to be minted from a Vault`
    },
    {
      name: 'Max LTV',
      value: `${(list?.maxLTV as number) * 100} % `,
      tooltipMsg: `Max Loan to Value Ratio`
    }
  ]
  const renderedItems = items.map((item, index) => (
    <li key={index} className="mr-[40px] text-center">
      <Tooltip>
        <TooltipTrigger>
          <span>
            {item.name}: {index == 0 && <s>5.5</s>} {item.value}{' '}
            {item.tooltipMsg && 'ⓘ'}
          </span>
        </TooltipTrigger>
        {item.tooltipMsg && <TooltipContent>{item.tooltipMsg}</TooltipContent>}
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
