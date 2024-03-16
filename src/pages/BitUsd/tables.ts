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
    message:
      'The annual Stability Fee for vaults, calculated based on your outstanding vault debt.',
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'vaultFloor',
    title: 'Vault floor',
    message: 'Minimum amount of bitUSD required to be minted from a Vault',
    format: (item) => displayMintingPairValues(item).vaultFloor
  },
  {
    key: 'liquidity',
    title: 'Global bitUSD available',
    message:
      'Amount of bitUSD available to be generated from BTC according the global protocol debt ceiling',
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
    title: 'Liquidation price',
    message: 'liquidation price',
    format: (item) => displayVaultValues(item).liquidationPrice
  },
  {
    key: 'healthFactor',
    title: 'Health factor',
    message: 'health factor',
    format: (item) => displayVaultValues(item).healthFactor
  },
  {
    key: 'lockedCollateral',
    title: 'Locked collateral',
    message: 'Maximum amount of bitUSD that can to be minted from a Vault',
    format: (item) => displayVaultValues(item).lockedCollateral
  },
  {
    key: 'availableToWithdraw',
    title: 'Available to withdraw',
    message: 'Max Loan to Value Ratio',
    format: (item) => displayVaultValues(item).availableToWithdraw
  },
  {
    key: 'debtBitUSD',
    title: 'Debt bitUSD',
    message: 'Minimum amount of bitUSD required to be minted from a Vault',
    format: (item) => displayVaultValues(item).debtBitUSD
  },
  {
    key: 'availableToMint',
    title: 'Available to mint',
    message: 'Max Loan to Value Ratio',
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
    title: 'Borrow rate',
    message: 'borrow rate',
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'liquidity',
    title: 'Liquidity',
    message: 'liquidity',
    format: (item) => displayMintingPairValues(item).liquidity
  },
  {
    key: 'liquidationPenalty',
    title: 'Liquidity Penalty',
    message: 'liquidity penalty',
    format: (item) => displayMintingPairValues(item).liquidationPenalty
  },
  {
    key: 'vaultCeiling',
    title: 'Vault Ceiling',
    message: 'vaultCeiling',
    format: (item) => displayMintingPairValues(item).vaultCeiling
  }
]
