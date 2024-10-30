import { AxiosInstance } from 'axios'

interface RecommendedFees {
  fastestFee: number
  halfHourFee: number
  hourFee: number
  economyFee: number
  minimumFee: number
}
interface TxResponse {
  txid: string
  version: number
  locktime: number
  vin: []
  vout: []
  size: number
  weight: number
  fee: number
  status?: TxStatus
}
interface TxStatus {
  confirmed: boolean
  block_height: number
  block_hash: string
  block_time: number
}

export const MempoolService = (axiosInstance: AxiosInstance) => ({
  getRecommendedFees: {
    key: 'mempool.getRecommendedFees',
    call: () =>
      axiosInstance
        .get<RecommendedFees>('/v1/fees/recommended')
        .then((data) => data.data)
  },
  getTransaction: {
    key: 'mempool.getTransaction',
    call: (txId: string) =>
      axiosInstance.get<TxResponse>(`/tx/${txId}`).then((data) => data.data)
  },
  postTransaction: {
    key: 'mempool.broadcastTx',
    call: (txnHex: string) =>
      axiosInstance.post<string>('/tx', txnHex).then((data) => data.data)
  }
})
