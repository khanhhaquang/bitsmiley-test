import { customChains, merlinMainnet, merlinTestnet } from '@/config/wagmi'
import { ReactNode, useMemo, useState } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import NetworkErrorPage from '@/pages/NetworkError'
import LoadingResourcesPage from '@/pages/LoadingResources'
import {
  ConnectProvider as BTCConnectProvider,
  OKXConnector,
  UnisatConnector
} from '@particle-network/btc-connectkit'

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
        [merlinMainnet.id]: http()
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
                chainIds: supportedChainIds,
                version: '1.0.0'
              }
            ]
          }
        }
      }}
      connectors={[new OKXConnector(), new UnisatConnector()]}>
      <WagmiProvider reconnectOnMount={false} config={config}>
        {children}
      </WagmiProvider>
    </BTCConnectProvider>
  )
}

export default CustomWagmiProvider
