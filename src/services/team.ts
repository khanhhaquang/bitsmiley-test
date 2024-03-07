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
  invitationCode?: string
  yesterdayPoint?: number
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
  }
}
