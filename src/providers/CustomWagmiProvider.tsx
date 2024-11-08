import {
  ConnectProvider as BTCConnectProvider,
  OKXConnector,
  UnisatConnector,
  BybitConnector,
  BitgetConnector,
  XverseConnector
} from '@particle-network/btc-connectkit'
import { ReactNode, useMemo, useState } from 'react'
import { fallback, Transport } from 'viem'
import { WagmiProvider, createConfig, http, unstable_connector } from 'wagmi'
import { injected } from 'wagmi/connectors'

import { chainsNotSupportedByParticle } from '@/config/wagmi'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useSupportedChains } from '@/hooks/useSupportedChains'
import LoadingResourcesPage from '@/pages/LoadingResources'
import NetworkErrorPage from '@/pages/NetworkError'

const CustomWagmiProvider = ({ children }: { children: ReactNode }) => {
  const [isEntered, setIsEntered] = useState(false)
  const { isLoading: isLoadingProject, isError } = useProjectInfo()
  const { supportedChains, supportedChainIds } = useSupportedChains()
  const { isLoading: isLoadingResources } = usePreloadResources()

  const config = useMemo(() => {
    if (supportedChains.length === 0) return undefined

    const [initialChains, ...restChains] = supportedChains
    const transports = supportedChains.reduce<Record<number, Transport>>(
      (acc, c) => ({
        ...acc,
        [c.id]: fallback([unstable_connector(injected), http()])
      }),
      {}
    )

    return createConfig({
      chains: [initialChains, ...restChains],
      transports
    })
  }, [supportedChains])

  if (isLoadingProject || isLoadingResources || !isEntered)
    return (
      <LoadingResourcesPage
        onEnter={() => setIsEntered(true)}
        isLoading={isLoadingProject || isLoadingResources}
      />
    )

  if (isError || !config) return <NetworkErrorPage />

  return (
    <BTCConnectProvider
      autoConnect={false}
      options={{
        projectId: import.meta.env.VITE_PARTICLE_PROJECT_ID as string,
        clientKey: import.meta.env.VITE_PARTICLE_CLIENT_KEY as string,
        appId: import.meta.env.VITE_PARTICLE_APP_ID as string,
        aaOptions: {
          accountContracts: {
            BTC: [
              {
                chainIds: supportedChainIds.filter(
                  (v) => !chainsNotSupportedByParticle.includes(v)
                ),
                version: '1.0.0'
              }
            ]
          }
        },
        walletOptions: {
          visible: import.meta.env.VITE_PARTICLE_WALLET_VISIBLE === 'true'
        }
      }}
      connectors={[
        new OKXConnector(),
        new UnisatConnector(),
        new BybitConnector(),
        new BitgetConnector(),
        new XverseConnector()
      ]}>
      <WagmiProvider reconnectOnMount={false} config={config}>
        {children}
      </WagmiProvider>
    </BTCConnectProvider>
  )
}

export default CustomWagmiProvider
