import { axiosInstance } from '@/config/axios'
import { IReseponse } from '@/types/common'

export enum InvalidReasonEnum {
  NotStarted = 'minting not started yet',
  AddressAlreadyInscribed = 'address already inscribed nft',
  WhitelistMaxCountReached = 'max number of inscriptions in whitelist round already inscribed',
  PublicMaxCountReached = 'max number of inscriptions in public sale round already inscribed',
  NotWhitelisted = 'address not whitelisted for inscription'
}

export interface INftsData {
  count?: number
  nfts?: INft[]
}

export interface INft {
  txid?: string
  nft_id?: string
  address?: string
  inscription_id?: string
  invalid_reason?: InvalidReasonEnum | null
}

export const UserService = {
  getHasActivatedInvitation: {
    key: 'user.getHasActivatedInvitation',
    call: (address: string) =>
      axiosInstance.post<IReseponse<boolean>>(
        `/user/hasActivatedInvitation?address=${address}`
      )
  },

  getNFTs: {
    key: 'user.getNFTs',
    call: (address: string) =>
      axiosInstance.post<IReseponse<INftsData>>(
        `/user/getNFTs?address=${address}&pageNumber=0`
      )
  }
}
