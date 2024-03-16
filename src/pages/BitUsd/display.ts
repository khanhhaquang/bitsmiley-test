import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'
import {
  formatNumberAsCompact,
  formatNumberWithSeparator
} from '@/utils/number'

const WBTC_UNIT = ' wBTC'
const BITUSD_UNIT = ' bitUSD'
const PERCENTAGE_UNIT = '%'
const DOLLAR_UNIT = '$'

const DEFAULT_TEXT = '-'

export const displayVaultValues = (
  vault?: IVault,
  withUnit: boolean = true
) => ({
  liquidationPrice:
    (!vault?.liquidationPrice
      ? DEFAULT_TEXT
      : formatNumberAsCompact(vault.liquidationPrice)) +
    `${withUnit ? DOLLAR_UNIT : ''}`,
  healthFactor:
    (!vault?.healthFactor
      ? DEFAULT_TEXT
      : formatNumberWithSeparator(vault.healthFactor)) +
    `${withUnit ? PERCENTAGE_UNIT : ''}`,
  debtBitUSD:
    (!vault?.debtBitUSD
      ? DEFAULT_TEXT
      : formatNumberAsCompact(vault.debtBitUSD)) +
    `${withUnit ? BITUSD_UNIT : ''}`,
  lockedCollateral:
    (!vault?.lockedCollateral
      ? DEFAULT_TEXT
      : formatNumberAsCompact(vault.lockedCollateral)) +
    `${withUnit ? WBTC_UNIT : ''}`,
  availableToWithdraw:
    (!vault?.availableToWithdraw
      ? DEFAULT_TEXT
      : formatNumberAsCompact(vault.availableToWithdraw)) +
    `${withUnit ? WBTC_UNIT : ''}`,
  availableToMint:
    (!vault?.availableToMint
      ? DEFAULT_TEXT
      : formatNumberAsCompact(vault.availableToMint)) +
    `${withUnit ? BITUSD_UNIT : ''}`
})

export const displayMintingPairValues = (
  value?: IMintingPair,
  withUnit: boolean = true
) => ({
  maxLTV:
    (!value?.maxLTV
      ? DEFAULT_TEXT
      : formatNumberAsCompact(Number(value.maxLTV) * 100)) +
    `${withUnit ? PERCENTAGE_UNIT : ''}`,
  borrowRate:
    (!value?.borrowRate
      ? DEFAULT_TEXT
      : formatNumberAsCompact(Number(value.borrowRate) * 100)) +
    `${withUnit ? PERCENTAGE_UNIT : ''}`,
  liquidationPenalty:
    (!value?.liquidationPenalty
      ? DEFAULT_TEXT
      : formatNumberAsCompact(Number(value.liquidationPenalty) * 100)) +
    `${withUnit ? PERCENTAGE_UNIT : ''}`,

  collateralRatio:
    (!value?.collateralRatio
      ? DEFAULT_TEXT
      : formatNumberAsCompact(Number(value.collateralRatio))) +
    `${withUnit ? PERCENTAGE_UNIT : ''}`,
  liquidity:
    (!value?.liquidity
      ? DEFAULT_TEXT
      : formatNumberAsCompact(value.liquidity)) +
    `${withUnit ? BITUSD_UNIT : ''}`,
  vaultCeiling:
    (!value?.vaultCeiling
      ? DEFAULT_TEXT
      : formatNumberAsCompact(value.vaultCeiling)) +
    `${withUnit ? BITUSD_UNIT : ''}`,
  vaultFloor:
    (!value?.vaultFloor
      ? DEFAULT_TEXT
      : formatNumberAsCompact(value.vaultFloor)) +
    `${withUnit ? BITUSD_UNIT : ''}`,
  collateralLocked:
    (!value?.collateralLocked
      ? DEFAULT_TEXT
      : formatNumberAsCompact(value.collateralLocked)) +
    `${withUnit ? BITUSD_UNIT : ''}`,
  totalDebt:
    (!value?.totalDebt
      ? DEFAULT_TEXT
      : formatNumberAsCompact(value.totalDebt)) +
    `${withUnit ? BITUSD_UNIT : ''}`,

  network: !value?.network ? DEFAULT_TEXT : value.network,
  chainId: !value?.chainId ? DEFAULT_TEXT : value.chainId,
  isOpenVault: !!value?.isOpenVault
})
