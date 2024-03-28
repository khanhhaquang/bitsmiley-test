import { Address } from 'viem'

import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export interface IContractAddresses {
  BitSmiley: Address
  BitUSDL2: Address
  VaultManager: Address
  WBTC: Address
  oracle: Address
  staking: Address | null
  l2nft: Address | null
  bitSmileyQuery: Address | null
}
export interface INetworkInfo {
  network: string
  chainId: number
  contract: IContractAddresses
}
export interface IProject {
  nowTime: string
  startTime: string
  web3Info: INetworkInfo[]
}

export const ProjectService = {
  getProjectInfo: {
    key: 'project.getProjectInfo',
    call: () =>
      axiosInstance
        .get<IResponse<IProject>>('/bsInfo/projectInfo ')
        .then((res) => res.data)
  }
}
