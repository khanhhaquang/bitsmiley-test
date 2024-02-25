export enum LoginTypeEnum {
  OKX = 'okx',
  UNISAT = 'unisat'
}

export interface IAccountInfo {
  address: string
  publicKey: string
}

export interface IResponse<T> {
  data: T
  code: number
  message: string
}
