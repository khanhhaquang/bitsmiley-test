import { Address } from 'viem'

export interface IVault {
  liquidationPrice?: string
  healthFactor?: string
  debtBitUSD?: string
  fee?: string
  mintedBitUSD?: string
  lockedCollateral?: string
  availableToWithdraw?: string
  availableToMint?: string
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
export interface ICollateralFromChain {
  collateral: {
    maxDebt: bigint
    safetyFactor: bigint
    tokenAddress: Address
    totalDebt: bigint
    totalLocked: bigint
    vaultMaxDebt: bigint
    vaultMinDebt: bigint
  }
  collateralId: Address
  liquidationFeeRate: bigint
  maxLTV: bigint
  name: string
  stabilityFeeRate: bigint
}
