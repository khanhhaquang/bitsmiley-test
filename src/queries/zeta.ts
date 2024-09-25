import { QueryObserverOptions, useQuery } from '@tanstack/react-query'
import { Hash } from 'viem'

import { useZetaService } from '@/hooks/useZetaService'
import { InboundHashToCctxResponse, CctxResponse } from '@/services/zeta'

export const useGetInboundHashToCctx = (
  hash: string,
  collateralId: string,
  evmAddress?: string,
  options?: Omit<
    QueryObserverOptions<InboundHashToCctxResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const ZetaService = useZetaService()
  return useQuery({
    queryKey: [ZetaService.inboundHashToCctx.key, collateralId, evmAddress],
    queryFn: () => ZetaService.inboundHashToCctx.call(hash),
    ...options
  })
}

export const useGetCctx = (
  txn: Hash,
  collateralId: string,
  evmAddress?: string,
  options?: Omit<
    QueryObserverOptions<CctxResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const ZetaService = useZetaService()
  return useQuery({
    queryKey: [ZetaService.getCctxDetail.key, collateralId, evmAddress],
    queryFn: () => ZetaService.getCctxDetail.call(txn),
    ...options
  })
}
