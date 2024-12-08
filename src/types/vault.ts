import { Address } from 'viem'

import { ILiquidatedDetail } from '@/services/user'

export interface IVault {
  liquidationPrice?: string
  healthFactor?: string
  debtBitUSD?: string
  fee?: string
  mintedBitUSD?: string
  lockedCollateral?: string
  availableToWithdraw?: string
  availableToMint?: string

  collateralSymbol?: string
}

export interface IVaultFromChain {
  liquidationPrice: bigint
  healthFactor: bigint
  debt: bigint
  fee: bigint
  mintedBitUSD: bigint
  lockedCollateral: bigint
  availableToWithdraw: bigint
  availableToMint: bigint
}

export interface IDetailedCollateralFromChain {
  name: string
  maxLTV: bigint
  isOpenVault: boolean
  collateralId: Address
  liquidationFeeRate: bigint
  stabilityFeeRate: bigint
  collateral: {
    maxDebt: bigint
    safetyFactor: bigint
    tokenAddress: Address
    totalDebt: bigint
    totalLocked: bigint
    vaultMaxDebt: bigint
    vaultMinDebt: bigint
  }

  // opened vault
  availableToMint?: bigint
  availableToWithdraw?: bigint
  debt?: bigint
  fee?: bigint
  healthFactor?: bigint
  liquidationPrice?: bigint
  lockedCollateral?: bigint
  mintedBitUSD?: bigint

  // from UserService.getLiquidated
  liquidated?: ILiquidatedDetail[]
}

export interface IDetailedCollateral {
  chainId: number
  name?: string
  maxLTV?: string
  isOpenVault?: boolean
  collateralId?: Address | string
  liquidationFeeRate?: string
  collateral?: {
    decimals?: number
    tokenAddress: Address
    maxDebt: string
    safetyFactor: string
    totalDebt: string
    totalLocked: string
    vaultMaxDebt: string
    vaultMinDebt: string
  }
  // computed
  stabilityFee?: number

  // from UserService.getLiquidated
  liquidated?: ILiquidatedDetail[]

  // opened vault
  availableToMint?: string
  availableToWithdraw?: string
  debt?: string
  fee?: string
  healthFactor?: string
  liquidationPrice?: string
  lockedCollateral?: string
  mintedBitUSD?: string

  // injected from chain
  collateralSymbol?: string
}

export interface ICollateralFromChain {
  chainId: number
  vaultAddress?: Address
  collaterals?: IDetailedCollateralFromChain[]
}

export interface ICollateral {
  chainId: number
  vaultAddress?: Address
  collaterals?: IDetailedCollateral[]
}
