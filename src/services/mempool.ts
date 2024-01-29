import { axios } from '@/config/axios'
import { DOMAIN_URL } from '@/config/settings'

const axiosInstance = axios.create({
  baseURL: DOMAIN_URL.MEMPOOL_API
})

interface IMempoolVout {
  scriptpubkey: string
  scriptpubkey_asm: string
  scriptpubkey_type: string
  scriptpubkey_address: string
  value: number
}

interface IMempoolVin {
  txid: string
  vout: number
  prevout: IMempoolVout
  scriptsig: string
  scriptsig_asm: string
  witness: string[]
  is_coinbase: boolean
  sequence: number
}

interface ITransactionStatus {
  confirmed: boolean
  block_height: number
  block_hash: string
  block_time: number
}

export interface ITransactionInfo {
  txid: string
  version: number
  locktime: number
  vin: IMempoolVin[]
  vout: IMempoolVout[]
  size: number
  weight: number
  fee: number
  status: ITransactionStatus
}

export interface IRecommendedFee {
  fastestFee: number
  halfHourFee: number
  hourFee: number
  economyFee: number
  minimumFee: number
}

export const MempoolService = {
  getAddressTransactions: {
    key: 'mempool.getAddressTransactions',
    call: (address: string) =>
      axiosInstance.get<ITransactionInfo[]>(`/address/${address}/txs/mempool`)
  },
  getTransactionInfo: {
    key: 'mempool.getTransactionInfo',
    call: (txid: string) => axiosInstance.get<ITransactionInfo>(`/tx/${txid}`)
  },
  getRecommendedFees: {
    key: 'mempool.getRecommendedFees',
    call: () => axiosInstance.get<IRecommendedFee>('/v1/fees/recommended')
  }
}
