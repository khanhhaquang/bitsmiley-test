import axios from 'axios'
import { IReseponse } from '@/types/common'
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

const axiosInstance = axios.create({
  baseURL: DOMAIN_URL.UNISATE_API,
  headers: { Authorization: 'Bearer ' + UNISAT_API_KEY }
})

export const UnisatService = {
  createInscribeOrder: {
    key: 'unisat.createInscribeOrder',
    call: (data: ICreateUnisatInscribeOrderData) =>
      axiosInstance.post<IReseponse<IUnisatOrder>>(
        '/v2/inscribe/order/create',
        data
      )
  },
  searchInscribeOrder: {
    key: 'unisat.searchInscribeOrder',
    call: (orderId: string) =>
      axiosInstance.get<IReseponse<IUnisatOrder>>(
        `/v2/inscribe/order/${orderId}`
      )
  },
  getInscriptionInfo: {
    key: 'unisat.getInscriptionInfo',
    call: (inscriptionId: string) =>
      axiosInstance.get(`/v1/indexer/inscription/info/${inscriptionId}`)
  },
  getAddressTxHistory: {
    key: 'unisat.getAddressTxHistory',
    call: (address: string) =>
      axiosInstance.get(`/v1/indexer/address/${address}/history`)
  },
  getAddressInscriptionUtxo: {
    key: 'unisat.getAddressInscriptionUtxo',
    call: (address: string) =>
      axiosInstance.get(`/v1/indexer/address/${address}/inscription-utxo-data`)
  }
}
