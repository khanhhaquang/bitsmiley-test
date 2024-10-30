import { useMemo } from 'react'
import { useConnect } from 'wagmi'

import { WALLET_ID } from '@/config/links'

export const useEvmConnectors = () => {
  const { connectors } = useConnect()

  const metaMaskConnector = useMemo(
    () => connectors.find((c) => c.id === WALLET_ID.METAMASK),
    [connectors]
  )

  const okxConnector = useMemo(
    () => connectors.find((c) => c.id === WALLET_ID.OKX),
    [connectors]
  )

  const bybitConnector = useMemo(
    () => connectors.find((c) => c.id === WALLET_ID.BYBIT),
    [connectors]
  )
  const bitgetConnector = useMemo(
    () => connectors.find((c) => c.id === WALLET_ID.BITGET),
    [connectors]
  )

  return {
    metaMaskConnector,
    okxConnector,
    bybitConnector,
    bitgetConnector
  }
}
