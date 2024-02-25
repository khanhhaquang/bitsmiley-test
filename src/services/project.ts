import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export interface IProject {
  nftCount: string
  blockHeight: string
  publicMax: string
  whitelistMax: string
  publicStartBlockHeight: string
  whitelistEndBlockHeight: string
  whitelistStartBlockHeight: string
}

export enum InscriptionType {
  VALID = 1,
  VALID_INVALID = 2,
  INVALID = 3
}

export interface ICheckInscription {
  code?: number
  message?: {
    reason?: string
    valid_type?: InscriptionType
  }
}

export const ProjectService = {
  getProjectInfo: {
    key: 'project.getProjectInfo',
    call: () => axiosInstance.get<IResponse<IProject>>('/bsInfo/projectInfo ')
  }
}
