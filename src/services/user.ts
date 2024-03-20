import { Address, Hash } from 'viem'

import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export enum InvalidReasonEnum {
  NotStarted = 'minting not started yet',
  AddressAlreadyInscribed = 'address already inscribed nft',
  WhitelistMaxCountReached = 'max number of inscriptions in whitelist round already inscribed',
  PublicMaxCountReached = 'max number of inscriptions in public sale round already inscribed',
  NotWhitelisted = 'address not whitelisted for inscription'
}
export interface INft {
  blockNumber: number
  id: number
  mintOwner: Address
  mintTime: Date
  mintTxHash: Hash
  nftStatus: number
  owner: Address
  tokenID: number
  txHash: Hash
  updateTime: Date
}

export interface IMintingPair {
  availableToMint: string
  availableToWithdraw: string
  borrowRate: string
  chainId: number
  collateralLocked: string
  healthFactor: string
  isOpenVault: boolean
  liquidationPenalty: string
  liquidationPrice: string
  liquidity: string
  maxLTV: string
  network: string
  totalDebt: string
  vaultCeiling: string
  vaultFloor: string

  liquidated: {
    transactionHash: Address
    recipient: Address
    collateral: string
    bitUSD: string
    penalty: string
    blockNumber: number
    timestamp: number
  }[]
}

export enum FeatureEnabled {
  ENABLED = 'enable',
  DISABLED = 'disabled'
}
export interface IFeaturesEnabled {
  Staking: FeatureEnabled
  AlphaNet: FeatureEnabled
}

export const UserService = {
  getNFTs: {
    key: 'user.getNFTs',
    call: (address: Address): Promise<IResponse<INft[]>> =>
      axiosInstance.get(`/l2nft/getNFT/${address}`).then((res) => res.data)
  },
  getMintingPairs: {
    key: 'user.getMintingPairs',
    call: (address: Address): Promise<IResponse<IMintingPair[]>> =>
      axiosInstance
        .get(`user/getMintingPairsInfo/${address}`)
        .then((res) => res.data)
  },
  getEnabledFeatures: {
    key: 'project.getEnabledFeatures',
    call: (address: Address): Promise<IResponse<IFeaturesEnabled>> =>
      axiosInstance
        .get(`/bsInfo/v2/getFunctionalModuleInfo/${address}`)
        .then((res) => res.data)
  }
}
