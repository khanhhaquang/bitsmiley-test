import { ReactNode } from 'react'

import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'

import { displayMintingPairValues, displayVaultValues } from './display'

export type TTable<T> = {
  key: string
  title: string
  message?: string
  titleClassName?: string
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
    message: '123',
    format: (item) => displayMintingPairValues(item).maxLTV
  },
  {
    key: 'borrowRate',
    title: 'Stability Fee',
    message: '123',
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'vaultFloor',
    title: 'Vault Floor',
    message: '123',
    format: (item) => displayMintingPairValues(item, false).vaultFloor
  },
  {
    key: 'vaultCeiling',
    title: 'Vault Ceiling',
    message: '123',
    format: (item) => displayMintingPairValues(item, false).vaultCeiling
  },
  {
    key: 'liquidity',
    title: 'Global bitUSD Available',
    message: '123',
    titleClassName: 'text-wrap',
    format: (item) => displayMintingPairValues(item, false).liquidity
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
    message: '123',
    format: (item) => displayMintingPairValues(item).collateralLocked
  },
  {
    key: 'totalDebt',
    title: 'Vault Debt',
    message: '123',
    format: (item) => displayMintingPairValues(item).totalDebt
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: '123',
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
    title: 'Available To Withdraw',
    format: (item) => displayVaultValues(item).availableToWithdraw
  },
  {
    key: 'availableToMint',
    title: 'Available To Mint',
    format: (item) => displayVaultValues(item).availableToMint
  }
]

export const VaultChangesInfoTable: TTable<IVault> = [
  {
    key: 'collateralLocked',
    title: 'Collateral Locked',
    format: (item) => displayVaultValues(item).lockedCollateral
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: '123',
    format: (item) => displayVaultValues(item).healthFactor
  },
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    message: '123',
    format: (item) => displayVaultValues(item).liquidationPrice
  },
  {
    key: 'availableToMint',
    title: 'Available to Mint',
    format: (item) => displayVaultValues(item).availableToMint
  },
  {
    key: 'availableToWithdraw',
    title: 'Available To Withdraw',
    format: (item) => displayVaultValues(item).availableToWithdraw
  }
]

export const VaultInfoTable: TTable<IMintingPair> = [
  {
    key: 'collateralLocked',
    title: 'Collateral Locked',
    // TODO calculate
    // format: (item) => displayMintingPairValues(item).collateralLocked
    format: () => '--'
  },
  {
    key: 'totalDebt',
    title: 'Total Debt',
    // TODO calculate
    // format: (item) => displayMintingPairValues(item).totalDebt
    format: () => '--'
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: '123',
    // TODO calculate
    // format: (item) => displayMintingPairValues(item).collateralRatio
    format: () => '--'
  },
  {
    key: 'stabilityFee',
    title: 'Stability Fee',
    message: '123',
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'liquidityPenalty',
    title: 'Liquidity Penalty',
    message: '123',
    format: (item) => displayMintingPairValues(item).liquidationPenalty
  }
]
