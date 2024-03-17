import { ReactNode } from 'react'

import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'

import { displayMintingPairValues, displayVaultValues } from './display'

export type TTable<T> = {
  key: string
  title: string
  message?: string
  format: (item?: T) => ReactNode
}[]

export const AvailableMintingPairsTable: TTable<IMintingPair> = [
  {
    key: 'pairName',
    title: '',
    format: () => `wBTC - bitUSD`
  },
  {
    key: 'network',
    title: 'Network',
    format: (item) => displayMintingPairValues(item).network
  },
  {
    key: 'maxLTV',
    title: 'Max LTV',
    message: 'Max Loan to Value Ratio',
    format: (item) => displayMintingPairValues(item).maxLTV
  },
  {
    key: 'borrowRate',
    title: 'Borrow Rate',
    message: 'The annual stability fee for the bitusd minted',
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'vaultFloor',
    title: 'Vault Floor',
    message: 'Minimum amount of bitUSD required of a vault',
    format: (item) => displayMintingPairValues(item).vaultFloor
  },
  {
    key: 'liquidity',
    title: 'Vault Ceiling',
    message: 'Max amount of bitusd a vault can mint',
    format: (item) => displayMintingPairValues(item).liquidity
  }
]

export const MyVaultsMintingPairsTable: TTable<IMintingPair> = [
  {
    key: 'pairName',
    title: '',
    format: () => `wBTC - bitUSD`
  },
  {
    key: 'Network',
    title: 'Network',
    format: (item) => displayMintingPairValues(item).network
  },
  {
    key: 'collateral',
    title: 'Collateral',
    format: (item) => displayMintingPairValues(item).collateralLocked
  },
  {
    key: 'totalDebt',
    title: 'Total Debt',
    message: 'bitUSD debt + Stability Fee',
    format: (item) => displayMintingPairValues(item).totalDebt
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message:
      'Indicates the health status of an account. Any vaults that drop below 1 face liquidation.',
    format: (item) => displayMintingPairValues(item).collateralRatio
  }
]

export const MyVaultOverviewTable: TTable<IVault> = [
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    format: (item) => displayVaultValues(item).liquidationPrice
  },
  {
    key: 'availableToWithdraw',
    title: 'Available to withdraw',
    format: (item) => displayVaultValues(item).availableToWithdraw
  },
  {
    key: 'availableToMint',
    title: 'Available to mint',
    format: (item) => displayVaultValues(item).availableToMint
  }
]

export const VaultChangesInfoTable: TTable<IVault> = [
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    message:
      'Vault will be liquidated if the collateral price drops below this',
    format: (item) => displayVaultValues(item).liquidationPrice
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: 'Vault will be liquidated if the health factor is less than 100%',
    format: (item) => displayVaultValues(item).healthFactor
  },
  {
    key: 'lockedCollateral',
    title: 'Locked Collateral',
    message: 'Amount of collateral locked in vault',
    format: (item) => displayVaultValues(item).lockedCollateral
  },
  {
    key: 'availableToWithdraw',
    title: 'Available to withdraw',
    message: 'Max amount of collateral withdrawable from the vault',
    format: (item) => displayVaultValues(item).availableToWithdraw
  },
  {
    key: 'debtBitUSD',
    title: 'Debt bitUSD',
    message: 'Amount of bitusd minted',
    format: (item) => displayVaultValues(item).debtBitUSD
  },
  {
    key: 'availableToMint',
    title: 'Available to mint',
    message: 'Max amount of bitusd that can be minted from the vault',
    format: (item) => displayVaultValues(item).availableToMint
  }
]

export const VaultInfoTable: TTable<IMintingPair> = [
  {
    key: 'maxLTV',
    title: 'Max LTV',
    message: 'Max Loan to Value Ratio',
    format: (item) => displayMintingPairValues(item).maxLTV
  },
  {
    key: 'borrowRate',
    title: 'Borrow Rate',
    message: 'The annual stability fee for the bitusd minted',
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'liquidity',
    title: 'Vault Ceiling',
    message: 'Max amount of bitusd a vault can mint',
    format: (item) => displayMintingPairValues(item).liquidity
  },
  {
    key: 'liquidationPenalty',
    title: 'Liquidation Fee',
    message: 'Fee charged for liquidators',
    format: (item) => displayMintingPairValues(item).liquidationPenalty
  },
  {
    key: 'vaultCeiling',
    title: 'Vault Ceiling',
    message: 'Max amount of bitusd a vault can mint',
    format: (item) => displayMintingPairValues(item).vaultCeiling
  }
]
