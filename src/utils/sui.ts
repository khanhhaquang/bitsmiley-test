import { SUI_DECIMALS } from '@mysten/sui/utils'
import { formatUnits, keccak256, parseUnits, toHex } from 'viem'

import { BcsI64 } from '@/types/sui'

export const convertToMist = (
  amount: number | string | bigint,
  decimals: number = SUI_DECIMALS
) => {
  return parseUnits(amount.toString(), decimals)
}

export const parseFromMist = (
  amount: bigint | string | number,
  decimals: number = SUI_DECIMALS
) => {
  return formatUnits(BigInt(amount), decimals)
}

export const collateralHash = (collateral: string) =>
  keccak256(toHex(collateral))

export const toI64 = (value: bigint) =>
  BcsI64.serialize({
    value: Math.abs(Number(value)),
    is_negative: Number(value) < 0
  })

export const fromMistToSignValue = (
  v: number | string | bigint,
  isNegative: boolean = false,
  decimals: number = SUI_DECIMALS
) => {
  return (isNegative ? -1 : 1) * Number(parseFromMist(v, decimals))
}
