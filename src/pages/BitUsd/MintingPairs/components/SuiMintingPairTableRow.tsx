import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { ArrowRightDoubleIcon, ReturnUpIcon } from '@/assets/icons'
import { ActionButton } from '@/components/ActionButton'
import { Image } from '@/components/Image'
import { TableCell, TableRow } from '@/components/ui/table'
import { chainsIconUrl } from '@/config/chain'
import { useSuiToken } from '@/hooks/useSuiToken'
import { IDetailedSuiCollateral } from '@/types/sui'
import { cn } from '@/utils/cn'

import {
  displayCollateralValues,
  getHealthFactorTextColor
} from '../../display'
import { TTable } from '../../tables'

const SuiMintingPairTableRow: React.FC<{
  isOpened?: boolean
  collateral: IDetailedSuiCollateral
  table: TTable<IDetailedSuiCollateral>
}> = ({ collateral, table, isOpened }) => {
  const navigate = useNavigate()
  const { coinMetadata } = useSuiToken(collateral.collateral?.tokenAddress)

  const handleEnterVault = () => {
    navigate(`./vault/${collateral.chainId}/${collateral.collateralId}`)
  }

  const liquidated = collateral.liquidated?.[0]
  const liquidatedDate = dayjs(liquidated?.timestamp).format('DD/MM/YYYY')

  const healthFactor =
    !isOpened || !collateral?.healthFactor ? 0 : Number(collateral.healthFactor)

  const isInLiquidationRisk = useMemo(
    //TODO: confirm when to show this message
    () => isOpened && !!healthFactor && healthFactor < 120,
    [healthFactor, isOpened]
  )

  const liquidationMessage = useMemo(() => {
    if (liquidated) return `This vault was liquidated on ${liquidatedDate}`
    if (isInLiquidationRisk)
      return 'This vault is at the risk of liquidation. Repay bitUSD or deposit collateral to avoid liquidation'
    return ''
  }, [isInLiquidationRisk, liquidated, liquidatedDate])

  return (
    <>
      <TableRow className="py-3 [&_td]:w-[120px] [&_td]:p-0">
        {table.map(({ key, format, className }) => (
          <TableCell key={key} className={cn('text-nowrap', className)}>
            {format({ ...collateral, collateralSymbol: coinMetadata?.symbol })}
          </TableCell>
        ))}
        <TableCell className="flex w-[150px] items-center justify-end gap-x-2">
          <ActionButton onClick={() => handleEnterVault()}>
            <span className="flex items-center gap-x-2">
              Enter
              <ArrowRightDoubleIcon />
            </span>
          </ActionButton>
        </TableCell>
      </TableRow>

      {isOpened && (
        <TableRow className="-mt-4 justify-start gap-x-1 text-xs">
          <TableCell className="flex items-center gap-x-0.5">
            <Image src={chainsIconUrl[collateral.chainId]} width={15} />
            <span className="text-xs text-white/70">
              {displayCollateralValues(collateral).network}
            </span>
          </TableCell>
          {liquidationMessage && (
            <TableCell
              className={cn(
                'font-ibmr text-xs',
                getHealthFactorTextColor(healthFactor),
                liquidated && 'text-warning'
              )}>
              <span className="flex items-center gap-x-1">
                <ReturnUpIcon />
                {liquidationMessage}
              </span>
            </TableCell>
          )}
        </TableRow>
      )}
    </>
  )
}

export default SuiMintingPairTableRow
