import axiosInstance from '@/config/axios'
import { IReseponse } from '@/types/common'

export interface INftsData {
  count?: number
  nfts?: {
    txid?: string
    nft_id?: string
    address?: string
    inscription_id?: string
    invalid_reason?: string | null
  }[]
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
