export type IVault = {
  liquidationPrice?: string
  healthFactor?: string
  debtBitUSD?: string
  lockedCollateral?: string
  availableToWithdraw?: string
  availableToMint?: string
}

export type IVaultFromChain = {
  liquidationPrice: bigint
  healthFactor: bigint
  debtBitUSD: bigint
  lockedCollateral: bigint
  availableToWithdraw: bigint
  availableToMint: bigint
}
