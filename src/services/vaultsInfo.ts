import { axiosInstance } from '@/config/axios'
import { Address } from 'viem'

export const vaultsInfoService = {
  getMintingPairsRequest: {
    key: 'project.getMintingPairs',
    call: (address: Address) =>
      axiosInstance
        .get(`user/getMintingPairsInfo/${address}`)
        .then((res) => res.data)
  }
}
