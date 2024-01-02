export enum LoginTypeEnum {
  None = '',
  OKX = 'okx'
}

export interface IAccountInfo {
  address: string
  publicKey: string
  compressedPublicKey: string
}
