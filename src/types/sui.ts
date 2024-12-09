import { type InferBcsType } from '@mysten/bcs'
import { bcs } from '@mysten/sui/bcs'

import { ILiquidatedDetail } from '@/services/user'

import { IDetailedCollateral } from './vault'

export const Bytes32 = bcs.struct('Bytes32', {
  bytes: bcs.vector(bcs.u8())
})

export const BcsCollateralType = bcs.struct('CollateralType', {
  token: bcs.string(),
  decimals: bcs.u8(),
  safety_factor: bcs.u256(),
  risk_factor: bcs.u256(),
  max_debt: bcs.u256(),
  vault_min_debt: bcs.u256(),
  vault_max_debt: bcs.u256(),
  total_debt: bcs.u256(),
  total_locked: bcs.u256()
})

export const BcsCollateral = bcs.struct('Collateral', {
  name: bcs.string(),
  maxLtv: bcs.u64(),
  liquidationFeeRate: bcs.u64(),
  stabilityFeeRate: bcs.u64(),
  collateralId: Bytes32,
  collateral: BcsCollateralType
})

export const BcsI64 = bcs.struct('I64', {
  value: bcs.u64(),
  is_negative: bcs.bool()
})

export const BcsI256 = bcs.struct('I256', {
  value: bcs.u256(),
  is_negative: bcs.bool()
})

export const BcsVaultDetail = bcs.struct('VaultDetail', {
  liquidation_price: bcs.u256(),
  health_factor: bcs.u256(),
  debt: BcsI64,
  fee: bcs.u64(),
  minted_bitusd: bcs.u64(),
  locked_collateral: BcsI64,
  available_to_withdraw: BcsI256,
  available_to_mint: BcsI256
})

export type IBcsVaultDetail = InferBcsType<typeof BcsVaultDetail>

export const BcsOpenVault = bcs.struct('OpenVault', {
  health_factor: bcs.u256(),
  liquidation_price: bcs.u256(),
  available_to_withdraw: BcsI256,
  available_to_mint: BcsI256
})

export const BcsVaultInfo = bcs.struct('VaultInfo', {
  owner: bcs.Address,
  collateral_id: Bytes32
})

export interface IDetailedCollateralFromSuiChain {
  isOpenVault?: boolean

  name: string
  maxLtv: string
  collateralId: { bytes: number[] }
  liquidationFeeRate: string
  stabilityFeeRate: string

  collateral: {
    decimals: number
    max_debt: string
    safety_factor: string
    token: string
    total_debt: string
    total_locked: string
    vault_max_debt: string
    vault_min_debt: string
    risk_factor: string
  }

  // opened vault
  risk_factor?: string
  liquidation_price?: string
  health_factor?: string
  debt?: {
    value: string
    is_negative: boolean
  }
  fee?: string
  minted_bitusd?: string
  locked_collateral?: {
    value: string
    is_negative: boolean
  }
  available_to_withdraw?: {
    value: string | number | bigint
    is_negative: boolean
  }
  available_to_mint?: {
    value: string | number | bigint
    is_negative: boolean
  }

  // from UserService.getLiquidated
  liquidated?: ILiquidatedDetail[]
}

export interface ICollateralFromSuiChain {
  vaultAddress?: string
  collaterals?: IDetailedCollateralFromSuiChain[]
}

export interface ISuiCollateral {
  chainId: number
  vaultAddress?: string
  collaterals?: IDetailedCollateral[]
}
