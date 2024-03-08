import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'
import { Address } from 'viem'

export interface IUserPoint {
  id?: number
  joinTeam?: true
  address?: string
  bitDisc?: number
  totalPoint?: number
  createTime?: string
  updateTime?: string
  teamAddition?: number
  captainAddress?: string
  invitationCode?: string | null
  yesterdayPoint?: number
}

export type TPageable = {
  pageNumber: number
  pageSize: number
  offset: number
  unpaged: boolean
  paged: boolean
}

export interface ITeamRank {
  id?: number
  invitationCode?: string | null
  yesterdayPoint?: string
  captainAddress?: Address
  level?: number
  rank?: number
  teamTotal?: number
  totalPoint?: number
  teamAddition?: number
}

export interface IIndividualRank {
  id?: number
  address?: Address
  invitationCode?: string | null
  yesterdayPoint?: number
  bitDisc?: number
  joinTeam?: boolean
  captainAddress?: Address
  createTime?: string
  updateTime?: string
  totalPoint?: number
  teamAddition?: number
}

export interface IRank<T> {
  content?: T[]
  pageable?: TPageable
  last?: boolean
  totalPages?: number
  totalElements?: number
  first?: boolean
  numberOfElements?: number
  size?: number
  number?: number
  empty?: boolean
}

export interface IPageParams {
  page: number
  size: number
  search?: string
}

export const TeamService = {
  getUserPointInfo: {
    key: 'team.getUserPointInfo',
    call: (address: Address): Promise<IResponse<IUserPoint>> =>
      axiosInstance
        .get(`user/getUserPointInfo/${address}`)
        .then((res) => res.data)
  },
  createTeam: {
    key: 'team.createTeam',
    call: (captainAddress: Address): Promise<IResponse<IUserPoint>> =>
      axiosInstance
        .get(`/team/createTeam/${captainAddress}`)
        .then((res) => res.data)
  },
  joinTeam: {
    key: 'team.joinTeam',
    call: (address: Address, inviteCode: string): Promise<IResponse<object>> =>
      axiosInstance
        .post(`/team/joinTeam?address=${address}&inviteCode=${inviteCode}`)
        .then((res) => res.data)
  },
  getMyTeamInfo: {
    key: 'team.getMyTeamInfo',
    call: (address: Address): Promise<IResponse<IUserPoint>> =>
      axiosInstance
        .get(`/team/getMyTeamInfo/${address}`)
        .then((res) => res.data)
  },
  getTeamRank: {
    key: 'team.getTeamRank',
    call: (params: IPageParams) =>
      axiosInstance.post<IResponse<IRank<[ITeamRank, number]>>>(
        '/rank/getTeamRank',
        null,
        { params }
      )
  },
  getUserPointRank: {
    key: 'team.getUserPointRank',
    call: (params: IPageParams) =>
      axiosInstance.post<IResponse<IRank<[IIndividualRank, number]>>>(
        '/rank/getUserPointRank',
        null,
        { params }
      )
  }
}
