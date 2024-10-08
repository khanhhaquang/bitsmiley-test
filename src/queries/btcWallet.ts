import {
  QueryObserverOptions,
  useMutation,
  useQuery
} from '@tanstack/react-query'

import {
  BindingEvmPayload,
  BindingEvmResponse,
  BtcCheckWalletResponse,
  BtcWalletService
} from '@/services/btcWallet'
import { IResponse } from '@/types/common'

export const useBtcCheckWallet = (
  address: string,
  options?: Omit<
    QueryObserverOptions<IResponse<BtcCheckWalletResponse>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: [BtcWalletService.checkWallet.key, address],
    queryFn: () => BtcWalletService.checkWallet.call(address),
    ...options
  })
}

export const useBindEvmAddress = ({
  onSuccess,
  onError
}: {
  onSuccess?: (data: IResponse<BindingEvmResponse>) => void
  onError?: (error: Error) => void
}) => {
  return useMutation({
    mutationFn: (payload: BindingEvmPayload) =>
      BtcWalletService.bindingEVM.call(payload),
    onSuccess,
    onError
  })
}
