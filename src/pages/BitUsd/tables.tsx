import { ReactNode } from 'react'
import { GetTokenReturnType } from 'wagmi/actions'

import { Image } from '@/components/Image'
import { chainsIconUrl } from '@/config/chain'
import { customChains } from '@/config/wagmi'
import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'
import { cn } from '@/utils/cn'

import {
  DEFAULT_TEXT,
  displayMintingPairValues,
  displayVaultValues,
  getHealthFactorTextColor
} from './display'

export type TTable<T, P = unknown> = {
  key: string
  title?: string
  formatTitle?: (chainId?: string | number) => ReactNode
  message?: string
  className?: string
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
    'Collateral price below which your vault will be liquidated.',
  // TODO confirm message
  totalBitUSD: 'totalBitUSD',
  // TODO confirm message
  collateral: 'collateral'
}

export const AvailableMintingPairsTable: TTable<IMintingPair> = [
  {
    key: 'pairName',
    formatTitle: (chainId) =>
      !chainId ? (
        DEFAULT_TEXT
      ) : (
        <div
          className={cn(
            'flex items-center justify-start gap-x-0.5 text-nowrap'
          )}>
          <Image src={chainsIconUrl[chainId]} width={15} height={15} />
          {customChains.find((c) => c.id.toString() === chainId)?.name}
        </div>
      ),
    format: (item) => item?.name
  },
  {
    key: 'maxLTV',
    title: 'Max LTV',
    titleClassName: '!w-[70px] text-nowrap',
    className: '!w-[70px] text-nowrap',
    message: messages.maxLTV,
    format: (item) => displayMintingPairValues(item).collateralMaxLTV
  },
  {
    key: 'borrowRate',
    title: 'Stability Fee',
    titleClassName: '!w-[78px]',
    className: '!w-[78px]',
    message: messages.stabilityFee,
    format: (item) => displayMintingPairValues(item).collateralStabilityFee
  },
  {
    key: 'vaultFloor',
    title: 'Vault Floor',
    titleClassName: '!w-[99px] text-nowrap',
    className: '!w-[99px] text-nowrap',
    message: messages.vaultFloor,
    format: (item) => displayMintingPairValues(item, false).collateralVaultFloor
  },
  {
    key: 'vaultCeiling',
    title: 'Vault Ceiling',
    titleClassName: 'w-[113px] text-nowrap',
    className: 'w-[113px] text-nowrap',
    message: messages.vaultCeiling,
    format: (item) =>
      displayMintingPairValues(item, false).collateralVaultCeiling
  }
]

export const MyVaultsMintingPairsTable: TTable<IMintingPair> = [
  {
    key: 'pairName',
    title: '',
    format: (item) => item?.name
  },
  {
    key: 'collateral',
    title: 'Collateral',
    className: '!w-[100px]',
    titleClassName: '!w-[100px]',
    message: messages.collateral,
    format: (item) => displayMintingPairValues(item).lockedCollateral
  },
  {
    key: 'totalDebt',
    title: 'Total Debt',
    className: '!w-[92px]',
    titleClassName: '!w-[92px] text-nowrap',
    message: messages.totalDebt,
    format: (item) => displayMintingPairValues(item).totalDebt
  },
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    className: '!w-[123px]',
    titleClassName: '!w-[123px] text-nowrap',
    format: (item) => displayMintingPairValues(item).liquidationPrice
  },
  {
    key: 'healthFactor',
    title: 'Health Factor',
    className: '!w-[113px]',
    titleClassName: '!w-[113px] text-nowrap',
    message: messages.healthFactor,
    format: (item) => displayMintingPairValues(item).healthFactor
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
    format: (item) => displayMintingPairValues(item).collateralStabilityFee
  },
  {
    key: 'liquidationPenalty',
    title: 'Liquidation Fee',
    message: messages.liquidationFee,
    format: (item) =>
      displayMintingPairValues(item).collateralLiquidationFeeRate
  },
  {
    key: 'vaultFloor',
    title: 'Vault Floor',
    message: messages.vaultFloor,
    format: (item) => displayMintingPairValues(item).collateralVaultFloor
  }
]

export const ManageVaultVaultInfoTable: TTable<IVault, IMintingPair> = [
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    message: messages.liquidationPrice,
    format: (vault) => displayVaultValues(vault).liquidationPrice
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
    format: (vault) => (
      <span className={getHealthFactorTextColor(vault?.healthFactor)}>
        {displayVaultValues(vault).healthFactor}
      </span>
    )
  },
  {
    key: 'mintedBitUSD',
    title: 'Minted bitUSD',
    format: (vault) => displayVaultValues(vault).mintedBitUSD
  },
  {
    key: 'collateral',
    title: 'Collateral',
    format: (vault) => displayVaultValues(vault).lockedCollateral
  },
  {
    key: 'availableToMint',
    title: 'Available to Mint',
    format: (vault) => displayVaultValues(vault).availableToMint
  },
  {
    key: 'availableToWithdraw',
    title: 'Available To Withdraw',
    format: (vault) => displayVaultValues(vault).availableToWithdraw
  },
  {
    key: 'stabilityFee',
    title: 'Stability Fee',
    message: messages.stabilityFee,
    format: (_, mintingPair) =>
      displayMintingPairValues(mintingPair).collateralStabilityFee
  }
]

export const VaultChangesInfoTable: TTable<IVault> = [
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: messages.healthFactor,
    format: (item) => (
      <span className={getHealthFactorTextColor(item?.healthFactor)}>
        {displayVaultValues(item).healthFactor}
      </span>
    )
  },
  {
    key: 'liquidationPrice',
    title: 'Liquidation Price',
    message: messages.liquidationPrice,
    format: (item) => displayVaultValues(item).liquidationPrice
  },
  {
    key: 'collateralLocked',
    title: 'Collateral Locked',
    format: (item) => displayVaultValues(item).lockedCollateral
  },
  {
    key: 'totalDebt',
    title: 'Total Debt',
    message: messages.totalDebt,
    className: 'text-white',
    format: (vault) => displayVaultValues(vault).debtBitUSD
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

export const VaultOpenInfoTable: TTable<IVault> = [
  {
    key: 'healthFactor',
    title: 'Health Factor',
    message: messages.healthFactor,
    format: (vault) => (
      <span className={getHealthFactorTextColor(vault?.healthFactor)}>
        {displayVaultValues(vault).healthFactor}
      </span>
    )
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
    format: (vault) => displayVaultValues(vault).debtBitUSD
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
    format: (item) => displayMintingPairValues(item).collateralStabilityFee
  },
  {
    key: 'Liquidation Fee',
    title: 'liquidationFee',
    message: messages.liquidationFee,
    format: (item) =>
      displayMintingPairValues(item).collateralLiquidationFeeRate
  },
  {
    key: 'vaultFloor',
    title: 'Vault Floor',
    message: messages.vaultFloor,
    format: (item) => displayMintingPairValues(item).collateralVaultFloor
  }
]
