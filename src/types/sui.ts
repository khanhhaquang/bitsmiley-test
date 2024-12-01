import { bcs } from '@mysten/sui/bcs'

export const Bytes32 = bcs.struct('Bytes32', {
  bytes: bcs.vector(bcs.u8())
})

export const BcsCollateralType = bcs.struct('CollateralType', {
  token: bcs.string(),
  safety_factor: bcs.u256(),
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

export const BcsOpenVault = bcs.struct('OpenVault', {
  health_factor: bcs.u256(),
  liquidation_price: bcs.u256(),
  available_to_withdraw: BcsI256,
  available_to_mint: BcsI256
})
