import {
  QueryObserverOptions,
  useMutation,
  useQuery
} from '@tanstack/react-query'

import {
  AirdropService,
  ArcadeLuckyAccount,
  BuyArcadeLuckyPayload,
  BuyArcadeLuckyResponse,
  MyPreStakeResponse,
  PreStakeInfo,
  StakePayload
} from '@/services/airdrop'
import { IResponse } from '@/types/common'

export const useGetArcadeLuckyAccount = (
  options?: Omit<
    QueryObserverOptions<IResponse<ArcadeLuckyAccount>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [AirdropService.getArcadeLuckyAccount.key],
    queryFn: () => AirdropService.getArcadeLuckyAccount.call(),
    ...options
  })
}

export const useBuyArcadeLucky = ({
  onSuccess,
  onError
}: {
  onSuccess?: (data: IResponse<BuyArcadeLuckyResponse>) => void
  onError?: (error: Error) => void
}) => {
  return useMutation({
    mutationFn: (payload: BuyArcadeLuckyPayload) =>
      AirdropService.buyArcadeLucky.call(payload),
    onSuccess,
    onError
  })
}

export const useGetMyReward = (
  options?: Omit<
    QueryObserverOptions<IResponse<string>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [AirdropService.getMyReward.key],
    queryFn: () => AirdropService.getMyReward.call(),
    ...options
  })
}

export const useGetMyPreStake = (
  options?: Omit<
    QueryObserverOptions<IResponse<MyPreStakeResponse>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [AirdropService.getMyPreStake.key],
    queryFn: () => AirdropService.getMyPreStake.call(),
    ...options
  })
}

export const useGetPreStakeInfo = (
  options?: Omit<
    QueryObserverOptions<IResponse<PreStakeInfo>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [AirdropService.getPreStakeInfo.key],
    queryFn: () => AirdropService.getPreStakeInfo.call(),
    ...options
  })
}

export const useStake = ({
  onSuccess,
  onError
}: {
  onSuccess?: (data: IResponse<MyPreStakeResponse>) => void
  onError?: (error: Error) => void
}) => {
  return useMutation({
    mutationFn: (payload: StakePayload) => AirdropService.stake.call(payload),
    onSuccess,
    onError
  })
}

export const useUnStake = ({
  onSuccess,
  onError
}: {
  onSuccess?: (data: IResponse<MyPreStakeResponse>) => void
  onError?: (error: Error) => void
}) => {
  return useMutation({
    mutationFn: (payload: StakePayload) => AirdropService.unStake.call(payload),
    onSuccess,
    onError
  })
}
