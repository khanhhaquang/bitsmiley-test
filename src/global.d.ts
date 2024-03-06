/* eslint-disable @typescript-eslint/no-explicit-any */

declare interface Window {
  okxwallet?: any
  unisat?: any
}

declare interface WindowEventMap {
  'eip6963:announceProvider': CustomEvent
}
