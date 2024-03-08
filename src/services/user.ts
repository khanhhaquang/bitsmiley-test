import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'
import { Address, Hash } from 'viem'

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
  borrowRate: string
  chainId: number
  isOpenVault: boolean
  liquidity: string
  maxLTV: string
  minSize: string
  network: string
  totalDebt: string
  collateralRatio: number
  collateralLocked: number
  vaultFloor: number
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
  }
}
