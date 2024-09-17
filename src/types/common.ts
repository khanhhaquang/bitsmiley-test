export interface IResponse<T> {
  data: T
  code: number
  message: string
}

export enum LoginType {
  //EVM
  OKX_EVM = 'okx_evm',
  BYBIT_EVM = 'bybit_evm',
  BITGET_EVM = 'bitget_evm',
  METAMASK = 'metamask',

  //Bitcoin
  OKX = 'okx',
  UNISAT = 'unisat',
  BYBIT = 'bybit',
  BITGET = 'bitget',
  XVERSE = 'xverse'
}

export enum TransactionStatus {
  Idle = 'idle',
  Signing = 'signing',
  Processing = 'processing',
  Success = 'success',
  Failed = 'failed'
}
