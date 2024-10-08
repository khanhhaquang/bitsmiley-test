import {
  useBTCProvider,
  useETHProvider
} from '@particle-network/btc-connectkit'
import { useCallback, useEffect, useMemo } from 'react'
import { injected } from 'wagmi/connectors'

import { WALLET_ID } from '@/config/links'
import { customChains } from '@/config/wagmi'

export const useBtcConnectors = () => {
  const {
    account: evmAccount,
    chainId: evmChainId,
    provider: particleEvmProvider
  } = useETHProvider()
  console.log('🚀 ~ useBtcConnectors ~ evmChainId:', evmChainId)

  const { getNetwork, switchNetwork } = useBTCProvider()

  const generateConnector = useCallback(
    (id: string, name: string) => {
      return particleEvmProvider
        ? injected({
            target: () => ({
              id,
              name,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              provider: particleEvmProvider as any
            })
          })
        : undefined
    },
    [particleEvmProvider]
  )

  const okxWithParticleConnector = useMemo(
    () => generateConnector(WALLET_ID.OKX, 'OKX wallet'),
    [generateConnector]
  )

  const bybitWithParticleConnector = useMemo(
    () => generateConnector(WALLET_ID.BYBIT, 'Bybit wallet'),
    [generateConnector]
  )

  const bitgetWithParticleConnector = useMemo(
    () => generateConnector(WALLET_ID.BITGET, 'Bitget wallet'),
    [generateConnector]
  )

  const unisatConnector = useMemo(
    () => generateConnector(WALLET_ID.UNISAT, 'Unisat wallet'),
    [generateConnector]
  )

  const xverseWithParticleConnector = useMemo(
    () => generateConnector(WALLET_ID.XVERSE, 'Xverse Wallet'),
    [generateConnector]
  )

  const chain = useMemo(
    () => customChains.find((c) => c.id === evmChainId),
    [evmChainId]
  )

  useEffect(() => {
    if (!evmAccount || !chain) return

    getNetwork().then((network) => {
      if (chain.testnet && network === 'livenet') {
        switchNetwork('testnet')
      }

      if (!chain.testnet && network === 'testnet') {
        switchNetwork('livenet')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmAccount, chain])

  return {
    okxWithParticleConnector,
    bitgetWithParticleConnector,
    bybitWithParticleConnector,
    xverseWithParticleConnector,
    unisatConnector
  }
}
