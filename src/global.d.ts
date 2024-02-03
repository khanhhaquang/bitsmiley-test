/* eslint-disable @typescript-eslint/no-explicit-any */

declare interface Window {
  okxwallet?: {
    bitcoin?: any
    isConnected?: () => boolean
    isUnlock?: () => Promise<boolean>
  }
  unisat?: any
}
