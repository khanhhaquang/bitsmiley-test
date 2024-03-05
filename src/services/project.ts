import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'
import { Address } from 'viem'

export interface IContractAddresses {
  BitSmiley: Address
  BitUSDL2: Address
  VaultManager: Address
  WBTC: Address
  l2nft: Address
  oracle: Address
  staking: Address
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

export enum FeatureEnabled {
  ENABLED = 'enable',
  DISABLED = 'disabled'
}
export interface IFeaturesEnabled {
  Staking: FeatureEnabled
  AlphaNet: FeatureEnabled
}

export const ProjectService = {
  getProjectInfo: {
    key: 'project.getProjectInfo',
    call: () =>
      axiosInstance
        .get<IResponse<IProject>>('/bsInfo/projectInfo ')
        .then((res) => res.data)
  },
  getEnabledModules: {
    key: 'project.getEnabledModules',
    call: () =>
      axiosInstance.get<IResponse<IFeaturesEnabled>>(
        '/bsInfo/getFunctionalModuleInfo'
      )
  }
}
