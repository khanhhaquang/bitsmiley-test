/* eslint-disable @typescript-eslint/no-explicit-any */

declare interface Window {
  ethereum?: any
  okxwallet?: any
  unisat?: any
  bybitWallet?: any
  bitgetWallet?: any
}

declare interface WindowEventMap {
  'eip6963:announceProvider': CustomEvent
}
