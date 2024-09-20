import { axios } from '@/config/axios'

const MEMPOOL_URL = 'https://mempool.space/testnet/api'

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
  status: TxStatus
}
interface TxStatus {
  confirmed: boolean
  block_height: number
  block_hash: string
  block_time: number
}

export const MempoolService = {
  getRecommendedFees: {
    key: 'mempool.getRecommendedFees',
    call: () => axios.get<RecommendedFees>(`${MEMPOOL_URL}/v1/fees/recommended`)
  },
  getTransaction: {
    key: 'mempool.getTransaction',
    call: (txId: string) => axios.get<TxResponse>(`${MEMPOOL_URL}/tx/${txId}`)
  },
  postTransaction: {
    key: 'mempool.broadcastTx',
    call: (txnHex: string) =>
      axios.post<string>(`${MEMPOOL_URL}/tx`, txnHex).then((data) => data.data)
  }
}
