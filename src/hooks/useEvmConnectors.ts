import { useMemo, useSyncExternalStore } from 'react'
import { providerStore } from '@/store/providerStore'
import { injected } from 'wagmi/connectors'
import {
  useETHProvider,
  useETHProvider as useParticleETHProvider
} from '@particle-network/btc-connectkit'

const OKX_RDNS = 'com.okex.wallet'
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

  return {
    okx: okxConnector,
    metamask: metaMaskConnector
  }
}
