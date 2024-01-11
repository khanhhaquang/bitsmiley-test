import axiosInstance from '@/config/axios'
import { IReseponse } from '@/types/common'

export interface IUser {
  id: number
  gem: number
  goldGem: number
  goldNFTStatus: number
  whitelistStatus: number
  btcAddress: string | null
  invitationCode: string | null
}

export interface INft {}

export const UserService = {
  getUserInfo: {
    key: 'user.getUserInfo',
    call: (address: string) =>
      axiosInstance.post<IReseponse<IUser>>(
        `/user/getUserInfo?address=${address}`
      )
  },
  getHasActivatedInvitation: {
    key: 'user.getHasActivatedInvitation',
    call: (address: string) =>
      axiosInstance.post<IReseponse<boolean>>(
        `/user/hasActivatedInvitation?address=${address}`
      )
  },
  getIsGoldUser: {
    key: 'user.getIsGoldUser',
    call: (address: string) =>
      axiosInstance.post<IReseponse<boolean>>(
        `/user/isHoldingGoldNFT?address=${address}`
      )
  },
  mintNft: {
    key: 'user.mintNft',
    call: (address: string) =>
      axiosInstance.post<IReseponse<INft>>(`/user/mintNFT?address=${address}`)
  }
}
