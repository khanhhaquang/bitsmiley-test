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

export interface ILiquidatedDetail {
  transactionHash: Address
  recipient: Address
  collateral: string
  bitUSD: string
  penalty: string
  blockNumber: number
  timestamp: number
}

export interface ILiquidated {
  vaultAddress?: string
  liquidated?: ILiquidatedDetail[]
}

interface ILiquidatedParams {
  vault: { network: string; vaultAddress: Address }[]
}

export interface IFeaturesEnabled {
  Staking: boolean
  AlphaNet: boolean
  BitPoint: boolean
}

export interface IAirdropProofAndAmount {
  airdropContractAddress: Address
  id: number
  amountStr: string
  chainId: number
  proof: Hash[]
  userAddress: Address
}

export interface IAirdropProofResponse {
  airdropContractAddress: Address
  id: number
  amount: string
  chainId: number
  proof: Hash[]
  userAddress: Address
}

export interface LoginPayload {
  owner: string
  signature: string
}

export interface LoginResponse {
  token: string
}

export const UserService = {
  getNFTs: {
    key: 'user.getNFTs',
    call: (address: Address): Promise<IResponse<INft[]>> =>
      axiosInstance.get(`/l2nft/getNFT/${address}`).then((res) => res.data)
  },
  getLiquidated: {
    key: 'user.getLiquidated',
    call: (params: ILiquidatedParams): Promise<IResponse<ILiquidated>> =>
      axiosInstance.post('/user/getLiquidated', params).then((res) => res.data)
  },
  getEnabledFeatures: {
    key: 'user.getEnabledFeatures',
    call: (address: Address): Promise<IResponse<IFeaturesEnabled>> =>
      axiosInstance
        .get(`/bsInfo/v2/getFunctionalModuleInfo/${address}`)
        .then((res) => res.data)
  },
  getAirdropProofAndAmount: {
    key: 'user.getAirdropProofAndAmount',
    call: (
      chainId: number,
      userAddress: Address,
      airdropContractAddress: Address
    ): Promise<IResponse<IAirdropProofAndAmount>> =>
      axiosInstance
        .get(
          `/user/getUserProof/${chainId}/${airdropContractAddress}/${userAddress}`
        )
        .then((res) => res.data)
  },
  login: {
    key: 'user.login',
    call: (payload: LoginPayload) =>
      axiosInstance
        .post<IResponse<LoginResponse>>('/user/login', payload)
        .then((res) => res.data)
  },
  getAirdropProof: {
    key: 'user.getAirdropProof',
    call: (address: Address) =>
      axiosInstance
        .get<IResponse<IAirdropProofResponse>>(
          `/user/getAirdropProof/${address}`
        )
        .then((res) => res.data)
  }
}
