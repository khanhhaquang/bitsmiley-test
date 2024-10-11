import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export interface BindingEvmResponse {
  id: number
  btcAddress: string
  evmAddress: string
}

export interface BtcCheckWalletResponse {
  canBind?: boolean
  bindEVM?: string
}

export interface BindingEvmPayload {
  address: string
  signature: string
  message: string
}

export const BtcWalletService = {
  checkWallet: {
    key: 'btcWallet.checkWallet',
    call: (btcAddress: string) =>
      axiosInstance
        .get<IResponse<BtcCheckWalletResponse>>(
          `/btcWallet/checkWallet/${btcAddress}`
        )
        .then((data) => data.data)
  },
  bindingEVM: {
    key: 'btcWallet.bindingEVM',
    call: (payload: BindingEvmPayload) =>
      axiosInstance
        .post<IResponse<BindingEvmResponse>>(`/btcWallet/bindingEVM`, payload)
        .then((data) => data.data)
  }
}
