/* eslint-disable @typescript-eslint/no-explicit-any */

declare interface Window {
  okxwallet?: {
    bitcoin?: any
    isUnlock?: () => Promise<boolean>
  }
  unisat?: any
}
