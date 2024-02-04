import { axiosInstance } from '@/config/axios'

export interface IUnisatOrder<T> {
  orderId: string
  status: T
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
    status: InscriptionStatus
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
  dataURL: string
  devAddress?: string
  devFee?: number
  feeRate: number
  filename: string
  outputValue: number
  receiveAddress: string
}

export interface IInscriptionInfo {
  utxo: {
    txid: string
  }
}

export enum OrderStatus {
  pending = 'pending',
  payment_notenough = 'payment_notenough',
  payment_overpay = 'payment_overpay',
  payment_withinscription = 'payment_withinscription',
  payment_waitconfirmed = 'payment_waitconfirmed',
  payment_success = 'payment_success',
  ready = 'ready',
  inscribing = 'inscribing',
  minted = 'minted',
  closed = 'closed',
  refunded = 'refunded',
  cancel = 'cancel'
}

enum InscriptionStatus {
  pending = 'pending',
  unconfirmed = 'unconfirmed',
  confirmed = 'confirmed'
}

export const UnisatService = {
  createInscribeOrder: {
    key: 'unisat.createInscribeOrder',
    call: (data: ICreateUnisatInscribeOrderData) =>
      axiosInstance.post<IUnisatResponse<IUnisatOrder<OrderStatus>>>(
        '/unisat/createOrder',
        null,
        { params: data }
      )
  },
  searchInscribeOrder: {
    key: 'unisat.searchInscribeOrder',
    call: (orderId: string) =>
      axiosInstance.get<IUnisatResponse<IUnisatOrder<OrderStatus>>>(
        `/unisat/inscribe/order/${orderId}`
      )
  },
  getInscriptionInfo: {
    key: 'unisat.getInscriptionInfo',
    call: (inscriptionId: string) =>
      axiosInstance.get<IUnisatResponse<IInscriptionInfo>>(
        `/unisat/indexer/inscription/info/${inscriptionId}`
      )
  }
}
