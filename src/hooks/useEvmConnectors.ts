import { useSyncExternalStore } from 'react'
import { providerStore } from '@/store/providerStore'
import { injected } from 'wagmi/connectors'

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

  const okxProviderWithDetail = providersWithDetail.find(
    (p) => p.info.rdns === OKX_RDNS
  )
  const metamaskProviderWithDetail = providersWithDetail.find(
    (p) => p.info.rdns === METAMASK_RDNS
  )

  return {
    okx: !okxProviderWithDetail
      ? injected()
      : injected({
          target: () => ({
            id: OKX_RDNS,
            name: okxProviderWithDetail.info.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provider: okxProviderWithDetail.provider as any
          })
        }),
    metamask: !metamaskProviderWithDetail
      ? injected()
      : injected({
          target: () => ({
            id: METAMASK_RDNS,
            name: metamaskProviderWithDetail.info.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provider: metamaskProviderWithDetail.provider as any
          })
        })
  }
}
