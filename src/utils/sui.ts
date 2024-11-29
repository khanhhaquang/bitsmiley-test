import { MIST_PER_SUI } from '@mysten/sui/utils'
import { keccak256, toHex } from 'viem'

import { BcsI64 } from '@/types/sui'

export const convertToMist = (amount: number) => {
  return (BigInt(Number(MIST_PER_SUI) * amount) * MIST_PER_SUI) / MIST_PER_SUI
}

export const parseFromMist = (amount: bigint) => {
  return Number(amount / MIST_PER_SUI)
}

export const collateralHash = (collateral: string) => {
  return keccak256(toHex(collateral))
}

export const toI64 = (value: bigint) => {
  return BcsI64.serialize({
    value: Math.abs(Number(value)),
    is_negative: Number(value) < 0
  })
}
