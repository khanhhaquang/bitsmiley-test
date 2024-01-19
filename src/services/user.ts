import axiosInstance from '@/config/axios'
import { IReseponse } from '@/types/common'

export interface INft {}

export const UserService = {
  getHasActivatedInvitation: {
    key: 'user.getHasActivatedInvitation',
    call: (address: string) =>
      axiosInstance.post<IReseponse<boolean>>(
        `/user/hasActivatedInvitation?address=${address}`
      )
  },

  mintNft: {
    key: 'user.mintNft',
    call: (address: string) =>
      axiosInstance.post<IReseponse<INft>>(`/user/mintNFT?address=${address}`)
  }
}
