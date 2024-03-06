import { customChains, merlinMainnet, merlinTestnet } from '@/config/wagmi'
import { ReactNode, useMemo, useState } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import NetworkErrorPage from '@/pages/NetworkError'
import LoadingResourcesPage from '@/pages/LoadingResources'

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

  return <WagmiProvider config={config}>{children}</WagmiProvider>
}

export default CustomWagmiProvider
