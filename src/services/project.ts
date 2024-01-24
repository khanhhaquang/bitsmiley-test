import axiosInstance from '@/config/axios'
import { IReseponse } from '@/types/common'

export interface IProject {
  nftCount: string
  blockHeight: string
  publicMax: string
  whitelistMax: string
  publicStartBlockHeight: string
  whitelistEndBlockHeight: string
  whitelistStartBlockHeight: string
}

export const ProjectService = {
  getProjectInfo: {
    key: 'project.getProjectInfo',
    call: () => axiosInstance.get<IReseponse<IProject>>('/bsInfo/projectInfo ')
  }
}
