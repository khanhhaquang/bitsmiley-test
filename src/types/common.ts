export enum LoginTypeEnum {
  None = '',
  OKX = 'okx',
  UNISAT = 'unisat',
  XVERSE = 'xverse'
}

export interface IAccountInfo {
  address: string
  publicKey: string
}
