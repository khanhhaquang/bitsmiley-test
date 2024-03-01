import { Hash } from 'viem'

export interface IResponse<T> {
  data: T
  code: number
  message: string
}

export interface ITransactionInfo {
  address: Hash
  txid: Hash
}
