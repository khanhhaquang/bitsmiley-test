import { useQuery } from '@tanstack/react-query'

import { useMempool } from './useMempool'

export const useBtcFee = () => {
  const MempoolService = useMempool()

  const { data: recommendedFee, refetch: getRecommendedFee } = useQuery({
    queryKey: ['btc-connected-fee'],
    queryFn: () => MempoolService.getRecommendedFees.call()
  })

  return {
    recommendedFee,
    getRecommendedFee
  }
}
