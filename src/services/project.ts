import axiosInstance from '@/config/axios'
import { IReseponse } from '@/types/common'

export interface IProject {
  nowTime: string
  nftPrice: string
  startTime: string
  mintEndTime: string
  recipientsWalletAddress: string
}

export const ProjectService = {
  getProjectInfo: {
    key: 'project.getProjectInfo',
    call: () => axiosInstance.get<IReseponse<IProject>>('/naiInfo/projectInfo')
  }
}
