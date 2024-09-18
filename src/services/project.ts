import { Address } from 'viem'

import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export interface IAirdrop {
  address: Address
  airdropContractAddress: Address
  icon: string
  name: string
  symbol: string
  chainId: number
}

export interface IContractAddresses {
  BitSmiley: Address
  BitUSDL2: Address
  VaultManager: Address
  WBTC: Address
  oracle: Address
  staking: Address | null
  l2nft: Address | null
  bitSmileyQuery: Address | null
  register: Address
  airdrop: IAirdrop[]

  bitsmileyZetaConnector?: Address | null
  signatureUtil?: Address | null
}
export interface INetworkInfo {
  network: string
  chainId: number
  contract: IContractAddresses
  blockTime: number
  bridgeURL: string
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
