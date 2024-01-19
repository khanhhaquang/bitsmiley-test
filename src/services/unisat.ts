import axios from 'axios'
import { DOMAIN_URL, UNISAT_API_KEY } from '@/config/settings'

export interface IUnisatOrder {
  orderId: string
  status: 'pending' | 'inscribing' | 'minted'
  payAddress: string
  receiveAddress: string
  amount: number
  paidAmount: number
  outputValue: number
  feeRate: number
  minerFee: number
  serviceFee: number
  devFee: number
  files: {
    filename: string
    size: string
    status: 'pending' | 'unconfirmed' | 'confirmed'
    inscriptionId?: string
  }[]
  count: number
  pendingCount: number
  unconfirmedCount: number
  confirmedCount: number
  createTime: number
  refundTxid: string
  refundAmount: number
  refundFeeRate: number
}

interface IUnisatResponse<T> {
  code: number
  data: T | null
  msg: string
}

export interface ICreateUnisatInscribeOrderData {
  receiveAddress: string
  feeRate: number
  outputValue: number
  files: {
    filename: string
    dataURL: string
  }[]
  devAddress?: string
  devFee?: number
}

export interface IInscriptionInfo {
  utxo: {
    txid: string
  }
}

export interface ITransactionInfo {
  blkid: string
  confirmations: number
  height: number
  idx: number
  inSatoshi: number
  locktime: number
  nIn: number
  nInInscription: number
  nLostInscription: number
  nNewInscription: number
  nOut: number
  nOutInscription: number
  outSatoshi: number
  size: number
  timestamp: number
  txid: string
  witOffset: number
}

const axiosInstance = axios.create({
  baseURL: DOMAIN_URL.UNISATE_API,
  headers: { Authorization: 'Bearer ' + UNISAT_API_KEY }
})

export const UnisatService = {
  createInscribeOrder: {
    key: 'unisat.createInscribeOrder',
    call: (data: ICreateUnisatInscribeOrderData) =>
      axiosInstance.post<IUnisatResponse<IUnisatOrder>>(
        '/v2/inscribe/order/create',
        data
      )
  },
  searchInscribeOrder: {
    key: 'unisat.searchInscribeOrder',
    call: (orderId: string) =>
      axiosInstance.get<IUnisatResponse<IUnisatOrder>>(
        `/v2/inscribe/order/${orderId}`
      )
  },
  getInscriptionInfo: {
    key: 'unisat.getInscriptionInfo',
    call: (inscriptionId: string) =>
      axiosInstance.get<IUnisatResponse<IInscriptionInfo>>(
        `/v1/indexer/inscription/info/${inscriptionId}`
      )
  },
  getTransactionInfo: {
    key: 'unisat.getTransactionInfo',
    call: (txId: string) =>
      axiosInstance.get<IUnisatResponse<ITransactionInfo>>(
        `/v1/indexer/tx/${txId}`
      )
  }
}
