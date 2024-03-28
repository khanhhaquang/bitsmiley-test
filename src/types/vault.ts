export type IVault = {
  liquidationPrice?: string
  healthFactor?: string
  debtBitUSD?: string
  fee?: string
  mintedBitUSD?: string
  lockedCollateral?: string
  availableToWithdraw?: string
  availableToMint?: string
}

export type IVaultFromChain = {
  liquidationPrice: bigint
  healthFactor: bigint
  debt: bigint
  fee: bigint
  mintedBitUSD: bigint
  lockedCollateral: bigint
  availableToWithdraw: bigint
  availableToMint: bigint
}
