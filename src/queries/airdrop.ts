import {
  QueryObserverOptions,
  useMutation,
  useQuery
} from '@tanstack/react-query'

import {
  AirdropService,
  ArcadeLuckyAccount,
  BuyArcadeLuckyPayload,
  BuyArcadeLuckyResponse
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
