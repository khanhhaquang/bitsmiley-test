import {
  useBTCProvider,
  useETHProvider
} from '@particle-network/btc-connectkit'
import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

import { customChains } from '@/config/wagmi'
import { providerStore } from '@/store/providerStore'

const OKX_RDNS = 'com.okex.wallet'
const UNISAT_RDNS = 'unisat.io'
const METAMASK_RDNS = 'io.metamask'

export const useSyncProviders = () =>
  useSyncExternalStore(
    providerStore.subscribe,
    providerStore.value,
    providerStore.value
  )

export const useEvmConnectors = () => {
  const { connectors } = useConnect()
  // const providersWithDetail = useSyncProviders()

  // const metamaskProviderDetail = useMemo(
  //   () => providersWithDetail.find((p) => p.info.rdns === METAMASK_RDNS),
  //   [providersWithDetail]
  // )

  // const okxProviderDetail = useMemo(
  //   () => providersWithDetail.find((p) => p.info.rdns === OKX_RDNS),
  //   [providersWithDetail]
  // )

  const {
    evmAccount,
    chainId: evmChainId,
    provider: particleEvmProvider
  } = useETHProvider()
  console.log('🚀 ~ useEvmConnectors ~ evmAccount:', evmAccount)

  const { getNetwork, switchNetwork } = useBTCProvider()

  const okxWithParticleConnector = useMemo(
    () =>
      !particleEvmProvider
        ? undefined
        : injected({
            target: () => ({
              id: OKX_RDNS,
              name: 'OKX wallet',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              provider: particleEvmProvider as any
            })
          }),
    [particleEvmProvider]
  )

  const unisatConnector = useMemo(
    () =>
      !particleEvmProvider
        ? undefined
        : injected({
            target: () => ({
              id: UNISAT_RDNS,
              name: 'Unisat wallet',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              provider: particleEvmProvider as any
            })
          }),
    [particleEvmProvider]
  )

  const metaMaskConnector = useMemo(
    () => connectors.find((c) => c.id === METAMASK_RDNS),
    [connectors]
  )

  const okxConnector = useMemo(
    () => connectors.find((c) => c.id === OKX_RDNS),
    [connectors]
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
    // FOR BTC
    okxWithParticleConnector,
    unisatConnector,

    // FOR EVM
    metaMaskConnector,
    okxConnector
  }
}
