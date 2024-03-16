export interface IResponse<T> {
  data: T
  code: number
  message: string
}

export enum LoginType {
  OKX = 'okx',
  METAMASK = 'metamask',
  UNISAT = 'unisat'
}

export enum TransactionStatus {
  Idle = 'idle',
  Signing = 'signing',
  Processing = 'processing',
  Success = 'success',
  Failed = 'failed'
}
