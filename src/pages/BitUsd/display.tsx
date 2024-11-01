import { BitUsdIcon } from '@/assets/icons'
import { customChains } from '@/config/wagmi'
import { IDetailedCollateral, IVault } from '@/types/vault'
import {
  formatNumberAsCompact,
  formatNumberWithSeparator
} from '@/utils/number'

const WBTC_UNIT = ' wBTC'
const BITUSD_UNIT = (
  <BitUsdIcon width={9.5} height={11} className="text-yellow2" />
)
const PERCENTAGE_UNIT = '%'
const DOLLAR_UNIT = '$' // bitUsd

export const DEFAULT_TEXT = '--'

export const formatBitUsd = (
  v?: string | number,
  withUnit: boolean = true,
  compact: boolean = false
) => {
  if (!v || !Number(v)) return DEFAULT_TEXT

  return (
    <span className="flex items-center gap-x-1">
      {compact ? formatNumberAsCompact(v) : formatNumberWithSeparator(v)}
      {withUnit && BITUSD_UNIT}
    </span>
  )
}

export const formatWBtc = (
  v?: string | number,
  withUnit = true,
  compact: boolean = false,
  symbol = ''
) => {
  if (!v || !Number(v)) return DEFAULT_TEXT
  return (
    `${
      compact ? formatNumberAsCompact(v, 6) : formatNumberWithSeparator(v, 6)
    }` +
    `${withUnit ? WBTC_UNIT : ''}` +
    ` ${symbol}`
  )
}

export const formatMoney = (
  v?: string | number,
  withUnit: boolean = true,
  compact: boolean = false
) => {
  if (!v || !Number(v)) return DEFAULT_TEXT
  return (
    `${withUnit ? DOLLAR_UNIT : ''}` +
    `${compact ? formatNumberAsCompact(v) : formatNumberWithSeparator(v)}`
  )
}

const formatPercentage = (
  v?: string | number,
  withUnit: boolean = true,
  compact: boolean = false
) => {
  if (!v || !Number(v)) return DEFAULT_TEXT
  return (
    `${
      compact ? formatNumberAsCompact(v, 1) : formatNumberWithSeparator(v, 1)
    }` + `${withUnit ? PERCENTAGE_UNIT : ''}`
  )
}

export const displayVaultValues = (
  vault?: IVault,
  withUnit: boolean = true
) => ({
  fee: formatBitUsd(vault?.fee, withUnit),
  mintedBitUSD: formatBitUsd(vault?.mintedBitUSD, withUnit),
  liquidationPrice: formatMoney(vault?.liquidationPrice, withUnit),
  healthFactor: formatPercentage(vault?.healthFactor, withUnit),
  debtBitUSD: formatBitUsd(vault?.debtBitUSD, withUnit),
  lockedCollateral: formatWBtc(
    vault?.lockedCollateral,
    vault?.collateralSymbol ? false : true,
    undefined,
    vault?.collateralSymbol
  ),
  availableToWithdraw: formatWBtc(
    vault?.lockedCollateral,
    vault?.collateralSymbol ? false : true,
    undefined,
    vault?.collateralSymbol
  ),
  availableToMint: formatBitUsd(vault?.availableToMint, withUnit)
})

export const displayCollateralValues = (
  value?: IDetailedCollateral,
  withUnit: boolean = true
) => ({
  collateralMaxLTV: formatPercentage(Number(value?.maxLTV) * 100, withUnit),
  collateralLiquidationFeeRate: formatPercentage(
    Number(value?.liquidationFeeRate) * 100,
    withUnit
  ),
  collateralStabilityFee: formatPercentage(
    Number(value?.stabilityFee) * 100,
    withUnit
  ),
  collateralVaultCeiling: formatBitUsd(
    value?.collateral?.vaultMaxDebt,
    withUnit,
    true
  ),
  collateralVaultFloor: formatBitUsd(
    value?.collateral?.vaultMinDebt,
    withUnit,
    true
  ),
  collateralCollateralLocked: formatWBtc(
    value?.collateral?.totalLocked,
    withUnit,
    true
  ),
  collateralTotalDebt: formatBitUsd(
    value?.collateral?.totalDebt,
    withUnit,
    true
  ),

  fee: formatBitUsd(value?.fee, withUnit),
  lockedCollateral: formatWBtc(value?.lockedCollateral, withUnit, true),
  liquidationPrice: formatMoney(value?.liquidationPrice, withUnit),
  healthFactor: formatPercentage(value?.healthFactor, withUnit),
  totalDebt: formatBitUsd(value?.debt, withUnit, true),
  availableToWithdraw: formatWBtc(value?.availableToWithdraw, withUnit),
  availableToMint: formatBitUsd(value?.availableToMint, withUnit),

  network: customChains.find((c) => c.id === value?.chainId)?.name,
  isOpenVault: !!value?.isOpenVault
})

export const getHealthFactorTextColor = (v?: number | string) => {
  if (isNaN(Number(v)) || !v) return ''

  const healthFactor = Number(v)

  if (healthFactor >= 120) return 'text-green'
  if (healthFactor >= 110 && healthFactor < 120) return 'text-yellow'
  return 'text-warning'
}
