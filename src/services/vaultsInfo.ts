import { axiosInstance } from '@/config/axios'
import { Address } from 'viem'
import { IResponse } from '@/types/common'

export interface MintingPairs {
  isOpenVault?: boolean
  network?: string
  maxLTV?: number
  borrowRate?: number
  vaultFloor?: number
  liquidity?: number
  chainId?: number
  collateralRatio?: number
  collateralLocked?: number
  totalDebt?: number
}

export const vaultsInfoService = {
  getMintingPairsRequest: {
    key: 'project.getMintingPairs',
    call: (address: Address): Promise<IResponse<MintingPairs>> =>
      axiosInstance
        .get(`user/getMintingPairsInfo/${address}`)
        .then((res) => res.data)
  }
}
