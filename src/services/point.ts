import { Address } from 'viem'

import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export interface IPointAirdrop {
  id: number
  address: Address
  season: number
  pointUserId: number
  presentDate: string
  chainID: number
  airdropContract: Address
  totalPoint: number
  airDropToken: string
}

export const PointService = {
  getPointAirdrop: {
    key: 'point.getPointAirdrop',
    call: (address: Address) =>
      axiosInstance
        .get<IResponse<IPointAirdrop[]>>(
          `/point/getPointAirdropInfo/${address}`
        )
        .then((res) => res.data)
  }
}
