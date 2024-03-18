import { ReactNode } from 'react'
import { GetTokenReturnType } from 'wagmi/actions'

import { LinkOutIcon } from '@/assets/icons'
import { customChains } from '@/config/wagmi'
import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'

import {
  DEFAULT_TEXT,
  displayMintingPairValues,
  displayVaultValues
} from './display'

export type TTable<T, P = unknown> = {
  key: string
  title: string
  message?: string
  titleClassName?: string
  format: (item?: T, item2?: P) => ReactNode
}[]

export type TTokenSymbols = {
  from?: GetTokenReturnType
  to?: GetTokenReturnType
}

const messages = {
  healthFactor:
    'Indicates the health status of an account. Any vaults that drop below 1 face liquidation.Minimum accepted ratio is 100%.We recommend a ratio over 200% to keep the vault safe from liquidation.',
  stabilityFee:
    'The annual borrow rate for vaults, calculated based on your outstanding vault debt.',
  globalBitUsdAvailable:
    'Amount of bitUSD available to be generated from BTCMax LTV:Max.',
  maxLTV: 'MAX Loan to Value Ratio',
  vaultFloor: 'Minimum amount of bitUSD required to be minted by a Vault.',
  vaultCeiling: 'Maximum amount of bitUSD that can be minted by a Vault.',
  totalDebt: 'bitUSD debt + Stability Fee',
  liquidationPenalty: 'The fee that liquidators need to pay to the protocol.'
}

export const AvailableMintingPairsTable: TTable<IMintingPair, TTokenSymbols> = [
  {
    key: 'pairName',
    title: '',
    format: (_, token) =>
      `${token?.from?.symbol || DEFAULT_TEXT} - ${
        token?.to?.symbol || DEFAULT_TEXT
      }`
  },
  {
    key: 'maxLTV',
    title: 'Max LTV',
    message: messages.maxLTV,
    format: (item) => displayMintingPairValues(item).maxLTV
  },
  {
    key: 'borrowRate',
    title: 'Stability Fee',
    message: messages.stabilityFee,
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'vaultFloor',
    title: 'Vault Floor',
    message: messages.vaultFloor,
    format: (item) => displayMintingPairValues(item, false).vaultFloor
  },
  {
    key: 'vaultCeiling',
    title: 'Vault Ceiling',
    message: messages.vaultCeiling,
    format: (item) => displayMintingPairValues(item, false).vaultCeiling
  },
  {
    key: 'liquidity',
    title: 'Global bitUSD Available',
    message: messages.globalBitUsdAvailable,
    titleClassName: 'text-wrap',
    format: (item) => displayMintingPairValues(item, false).liquidity
  }
]

export const MyVaultsMintingPairsTable: TTable<IMintingPair, TTokenSymbols> = [
  {
    key: 'pairName',
    title: '',
    format: (_, token) =>
      `${token?.from?.symbol || DEFAULT_TEXT} - ${
        token?.to?.symbol || DEFAULT_TEXT
      }`
  },
  {
    key: 'Network',
    title: 'Network',
    format: (item) => {
      const chain = customChains.find((c) => c.id === item?.chainId)
      if (!chain) return DEFAULT_TEXT
      return (
        <span className="flex items-center justify-center gap-x-1">
          {chain.name}
          <a
            target="_blank"
            href={chain.blockExplorers?.default.url}
            className="shrink-0 cursor-pointer hover:text-white/70">
            <LinkOutIcon />
          </a>
        </span>
      )
    }
  },
  {
    key: 'collateral',
    title: 'Collateral',
    format: (item) => displayMintingPairValues(item).collateralLocked
  },
  {
    key: 'totalDebt',
    title: 'Total Debt',
    message: messages.totalDebt,
    format: (item) => displayMintingPairValues(item).totalDebt
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: messages.healthFactor,
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

export const ManageVaultHeaderInfoTable: TTable<IMintingPair> = [
  {
    key: 'network',
    title: 'Network',
    format: (item) => displayMintingPairValues(item).network
  },
  {
    key: 'stabilityFee',
    title: 'Stability Fee',
    message: messages.stabilityFee,
    format: (item) => displayMintingPairValues(item).borrowRate
  },
  {
    key: 'liquidationPenalty',
    title: 'Liquidation Penalty',
    message: messages.liquidationPenalty,
    format: (item) => displayMintingPairValues(item).liquidationPenalty
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
    message: messages.healthFactor,
    format: (item) => displayVaultValues(item).healthFactor
  },
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
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

export const VaultInfoTable: TTable<IVault, IMintingPair> = [
  {
    key: 'collateralLocked',
    title: 'Collateral Locked',
    format: (vault) => displayVaultValues(vault).lockedCollateral
  },
  {
    key: 'debtBitUSD',
    title: 'Total Debt',
    message: messages.totalDebt,
    format: (vault) => displayVaultValues(vault).debtBitUSD
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: messages.healthFactor,
    format: (vault) => displayVaultValues(vault).healthFactor
  },
  {
    key: 'stabilityFee',
    title: 'Stability Fee',
    message: messages.stabilityFee,
    format: (_, mintingPair) => displayMintingPairValues(mintingPair).borrowRate
  },
  {
    key: 'liquidityPenalty',
    title: 'Liquidity Penalty',
    message: messages.liquidationPenalty,
    format: (_, mintingPair) =>
      displayMintingPairValues(mintingPair).liquidationPenalty
  }
]
