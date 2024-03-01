import { axiosInstance } from '@/config/axios'


export const vaultsInfoService = {
  getMintingPairsInfo: {
    key: 'project.getMintingPairsInfo',
    call: (address: string) => axiosInstance.get(`user/getMintingPairsInfo/${address}`)
  },
}
