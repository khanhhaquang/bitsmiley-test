import axiosInstance from '@/config/axios'
import { IReseponse } from '@/types/common'

export interface INftsData {
  data?: {
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
      axiosInstance
        .post<IReseponse<string>>(
          `/user/getNFTs?address=${address}&pageNumber=0`
        )
        .then((res) => {
          if (res?.data.data === 'internal server error') {
            return { data: [] }
          }
          return JSON.parse(res.data.data) as INftsData
        })
  }
}
