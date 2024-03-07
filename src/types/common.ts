export interface IResponse<T> {
  data: T
  code: number
  message: string
}

export enum LoginType {
  OKX = 'okx',
  METAMASK = 'metamask'
}
