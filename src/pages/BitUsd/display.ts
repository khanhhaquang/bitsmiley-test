import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'
import {
  formatNumberAsCompact,
  formatNumberWithSeparator
} from '@/utils/number'

const WBTC_UNIT = ' wBTC'
const BITUSD_UNIT = '$'
const PERCENTAGE_UNIT = '%'
const DOLLAR_UNIT = '$' // bitUsd

export const DEFAULT_TEXT = '-'

export const formatBitUsd = (
  v?: string | number,
  withUnit: boolean = true,
  compact: boolean = false
) =>
  !v
    ? DEFAULT_TEXT
    : `${withUnit ? BITUSD_UNIT : ''}` +
      `${compact ? formatNumberAsCompact(v) : formatNumberWithSeparator(v)}`

export const formatWBtc = (
  v?: string | number,
  withUnit = true,
  compact: boolean = false
) =>
  !v
    ? DEFAULT_TEXT
    : `${
        compact ? formatNumberAsCompact(v, 4) : formatNumberWithSeparator(v, 4)
      }` + `${withUnit ? WBTC_UNIT : ''}`

export const formatMoney = (
  v?: string | number,
  withUnit: boolean = true,
  compact: boolean = false
) =>
  !v
    ? DEFAULT_TEXT
    : `${withUnit ? DOLLAR_UNIT : ''}` +
      `${compact ? formatNumberAsCompact(v) : formatNumberWithSeparator(v)}`

const formatPercentage = (
  v?: string | number,
  withUnit: boolean = true,
  compact: boolean = false
) =>
  !v
    ? DEFAULT_TEXT
    : `${
        compact ? formatNumberAsCompact(v, 1) : formatNumberWithSeparator(v, 1)
      }` + `${withUnit ? PERCENTAGE_UNIT : ''}`

export const displayVaultValues = (
  vault?: IVault,
  withUnit: boolean = true
) => ({
  liquidationPrice: formatMoney(vault?.liquidationPrice, withUnit),
  healthFactor: formatPercentage(vault?.healthFactor, withUnit),
  debtBitUSD: formatBitUsd(vault?.debtBitUSD, withUnit),
  lockedCollateral: formatWBtc(vault?.lockedCollateral, withUnit),
  availableToWithdraw: formatWBtc(vault?.availableToWithdraw, withUnit),
  availableToMint: formatBitUsd(vault?.availableToMint, withUnit)
})

export const displayMintingPairValues = (
  value?: IMintingPair,
  withUnit: boolean = true
) => ({
  maxLTV: formatPercentage(Number(value?.maxLTV) * 100, withUnit),
  borrowRate: !Number(value?.borrowRate)
    ? '0%'
    : formatPercentage(Number(value?.borrowRate) * 100, withUnit),
  liquidationPenalty: formatPercentage(
    Number(value?.liquidationPenalty) * 100,
    withUnit
  ),
  liquidationPrice: formatMoney(value?.liquidationPrice, withUnit),
  healthFactor: formatPercentage(Number(value?.healthFactor) * 100, withUnit),
  liquidity: formatBitUsd(value?.liquidity, withUnit, true),
  vaultCeiling: formatBitUsd(value?.vaultCeiling, withUnit, true),
  vaultFloor: formatBitUsd(value?.vaultFloor, withUnit, true),
  collateralLocked: formatWBtc(value?.collateralLocked, withUnit, true),
  totalDebt: formatBitUsd(value?.totalDebt, withUnit, true),
  availableToWithdraw: formatWBtc(value?.availableToWithdraw, withUnit),
  availableToMint: formatBitUsd(value?.availableToMint, withUnit),

  network: !value?.network ? DEFAULT_TEXT : value.network,
  chainId: !value?.chainId ? DEFAULT_TEXT : value.chainId,
  isOpenVault: !!value?.isOpenVault
})
