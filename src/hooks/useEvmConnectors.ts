import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { providerStore } from '@/store/providerStore'
import { injected } from 'wagmi/connectors'
import {
  useBTCProvider,
  useETHProvider,
  useETHProvider as useParticleETHProvider
} from '@particle-network/btc-connectkit'

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
  const providersWithDetail = useSyncProviders()

  const metamaskProviderWithDetail = providersWithDetail.find(
    (p) => p.info.rdns === METAMASK_RDNS
  )

  const { evmAccount } = useETHProvider()
  const { provider: particleEvmProvider } = useParticleETHProvider()

  const { getNetwork, switchNetwork } = useBTCProvider()

  const okxConnector = useMemo(
    () =>
      !particleEvmProvider || !evmAccount
        ? undefined
        : injected({
            target: () => ({
              id: OKX_RDNS,
              name: 'OKX wallet',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              provider: particleEvmProvider as any
            })
          }),
    [evmAccount, particleEvmProvider]
  )

  const unisatConnector = useMemo(
    () =>
      !particleEvmProvider || !evmAccount
        ? undefined
        : injected({
            target: () => ({
              id: UNISAT_RDNS,
              name: 'Unisat wallet',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              provider: particleEvmProvider as any
            })
          }),
    [evmAccount, particleEvmProvider]
  )

  const metaMaskConnector = useMemo(
    () =>
      !metamaskProviderWithDetail
        ? undefined
        : injected({
            target: () => ({
              id: METAMASK_RDNS,
              name: metamaskProviderWithDetail.info.name,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              provider: metamaskProviderWithDetail.provider as any
            })
          }),
    [metamaskProviderWithDetail]
  )

  useEffect(() => {
    if (!evmAccount) return

    getNetwork().then((network) => {
      if (network === 'livenet') {
        switchNetwork('testnet')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmAccount])

  return {
    okxConnector,
    metaMaskConnector,
    unisatConnector
  }
}
