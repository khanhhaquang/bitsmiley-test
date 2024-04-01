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
    key: 'project.getEnabledFeatures',
    call: (address: Address): Promise<IResponse<IFeaturesEnabled>> =>
      axiosInstance
        .get(`/bsInfo/v2/getFunctionalModuleInfo/${address}`)
        .then((res) => res.data)
  },
  getAllVaultInfo: {
    key: 'user.getAllVaultInfo',
    call: (): Promise<IResponse<Array<Record<string, Address>>>> =>
      axiosInstance.get('/user/getAllVaultInfo').then((res) => res.data)
  }
}
