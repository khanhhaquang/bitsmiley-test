import { ReactNode } from 'react'
import { GetTokenReturnType } from 'wagmi/actions'

import { BitUsdIcon, LinkOutIcon } from '@/assets/icons'
import { customChains } from '@/config/wagmi'
import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'

import { displayMintingPairValues, displayVaultValues } from './display'

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

export const messages = {
  healthFactor: 'If drops below 100.0%, the vault will be liquidated.',
  stabilityFee: 'Interest rate charged to the bitUSD minted.',
  maxLTV: 'MAX Loan to Value ratio.',
  vaultFloor: 'Minimum amount of bitUSD required to be minted.',
  vaultCeiling: 'Maximum amount of bitUSD that can be minted.',
  totalDebt: 'bitUSD minted plus the interest.',
  liquidationFee: 'The fee charged to liquidators.',
  liquidationPrice:
    'Collateral price below which your vault will be liquidated.'
}

export const AvailableMintingPairsTable: TTable<IMintingPair> = [
  {
    key: 'pairName',
    title: '',
    format: () => 'wBTC - bitUSD'
  },
  {
    key: 'chainId',
    title: 'Network',
    titleClassName: '!w-[100px]',
    format: (item) => (
      <span className="flex items-center gap-2">
        {item?.network}
        <a
          href={
            customChains.find((v) => v.id === item?.chainId)?.blockExplorers
              ?.default.url
          }
          target="_blank">
          <LinkOutIcon width={13} height={13} />
        </a>
      </span>
    )
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
    format: () => (
      <span className="flex items-center gap-x-1">
        <span className="line-through">13%</span>
        <span>0%</span>
      </span>
    )
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
  }
]

export const MyVaultsMintingPairsTable: TTable<IMintingPair> = [
  {
    key: 'pairName',
    title: '',
    format: () => 'wBTC - bitUSD'
  },
  {
    key: 'chainId',
    title: 'Network',
    format: (item) => (
      <span className="flex items-center gap-2">
        {item?.network}
        <a
          href={
            customChains.find((v) => v.id === item?.chainId)?.blockExplorers
              ?.default.url
          }
          target="_blank">
          <LinkOutIcon width={13} height={13} />
        </a>
      </span>
    )
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
    format: (item) => displayMintingPairValues(item).healthFactor
  }
]

export const MyVaultOverviewTable: TTable<IMintingPair> = [
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    message: messages.liquidationPrice,
    format: (item) => displayMintingPairValues(item).liquidationPrice
  },
  {
    key: 'availableToWithdraw',
    title: 'Available To Withdraw',
    format: (item) => displayMintingPairValues(item).availableToWithdraw
  },
  {
    key: 'availableToMint',
    title: 'Available To Mint',
    format: (item) => displayMintingPairValues(item).availableToMint
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
    format: () => (
      <span className="flex items-center gap-x-1">
        <span className="line-through">13%</span>
        <span>0%</span>
      </span>
    )
  },
  {
    key: 'liquidationPenalty',
    title: 'Liquidation Fee',
    message: messages.liquidationFee,
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
    key: 'totalDebt',
    title: 'Total Debt',
    message: messages.totalDebt,
    format: (vault) => displayVaultValues(vault).debtBitUSD
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
    message: messages.liquidationPrice,
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

export const VaultOpenInfoTable: TTable<IVault, IMintingPair> = [
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: messages.healthFactor,
    format: (vault) => displayVaultValues(vault).healthFactor
  },
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    message: messages.liquidationPrice,
    format: (vault) => displayVaultValues(vault).liquidationPrice
  },
  {
    key: 'collateralLocked',
    title: 'Collateral Locked',
    format: (vault) => displayVaultValues(vault).lockedCollateral
  },
  {
    key: 'debtBitUSD',
    title: 'Vault Debt',
    message: messages.totalDebt,
    format: (vault) => (
      <span className="flex items-center gap-x-1">
        {displayVaultValues(vault, false).debtBitUSD}{' '}
        {!!vault?.debtBitUSD && (
          <BitUsdIcon width={9.5} height={11} className="text-yellow2" />
        )}
      </span>
    )
  }
]

export const VaultHeaderColumns: TTable<IMintingPair> = [
  {
    key: 'network',
    title: 'Network',
    format: (item) => displayMintingPairValues(item).network
  },
  {
    key: 'stabilityFee',
    title: 'Stability Fee',
    message: messages.stabilityFee,
    format: () => '0%'
  },
  {
    key: 'Liquidation Fee',
    title: 'liquidationFee',
    message: messages.liquidationFee,
    format: (item) => displayMintingPairValues(item).liquidationPenalty
  },
  {
    key: 'vaultFloor',
    title: 'Vault Floor',
    message: messages.stabilityFee,
    format: (item) => displayMintingPairValues(item).vaultFloor
  }
]
