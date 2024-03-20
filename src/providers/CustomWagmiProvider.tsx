import {
  ConnectProvider as BTCConnectProvider,
  OKXConnector,
  UnisatConnector
} from '@particle-network/btc-connectkit'
import { ReactNode, useMemo, useState } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'

import {
  bobTestnet,
  customChains,
  merlinMainnet,
  merlinTestnet
} from '@/config/wagmi'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import LoadingResourcesPage from '@/pages/LoadingResources'
import NetworkErrorPage from '@/pages/NetworkError'

const CustomWagmiProvider = ({ children }: { children: ReactNode }) => {
  const [isEntered, setIsEntered] = useState(false)
  const { projectInfo, isLoading: isLoadingProject, isError } = useProjectInfo()
  const { isLoading: isLoadingResources } = usePreloadResources()

  const supportedChainIds = useMemo(
    () => projectInfo?.web3Info?.map((v) => v.chainId) || [],
    [projectInfo?.web3Info]
  )

  const supportedChains = useMemo(
    () => customChains.filter((v) => supportedChainIds.includes(v.id)) || [],
    [supportedChainIds]
  )

  const config = useMemo(() => {
    if (supportedChains.length === 0) return undefined

    const [initialChains, ...restChains] = supportedChains

    return createConfig({
      chains: [initialChains, ...restChains],
      transports: {
        [merlinTestnet.id]: http(),
        [merlinMainnet.id]: http(),
        [bobTestnet.id]: http()
      }
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
                //TODO: PARTICLE DOES NOT SUPPORT BOB YET
                chainIds: supportedChainIds.filter((v) => v !== bobTestnet.id),
                version: '1.0.0'
              }
            ]
          }
        },
        walletOptions: { visible: import.meta.env.DEV }
      }}
      connectors={[new OKXConnector(), new UnisatConnector()]}>
      <WagmiProvider reconnectOnMount={false} config={config}>
        {children}
      </WagmiProvider>
    </BTCConnectProvider>
  )
}

export default CustomWagmiProvider
