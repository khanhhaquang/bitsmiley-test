import axiosInstance from '@/config/axios'
import { IReseponse } from '@/types/common'

export interface IProject {
  nftCount: string
  startTime: string
  mintEndTime: string
  nowTime: string
  whitelistStartBlockHeight: string
  publicStartBlockHeight: string
  whitelistEndBlockHeight: string
}

export const ProjectService = {
  getProjectInfo: {
    key: 'project.getProjectInfo',
    call: () => axiosInstance.get<IReseponse<IProject>>('/bsInfo/projectInfo ')
  }
}
