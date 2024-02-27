import { customChains, merlinMainnet, merlinTestnet } from '@/config/wagmi'
import { ReactNode, useMemo } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { usePreloadResources } from '@/hooks/usePreloadResources'

const CustomWagmiProvider = ({ children }: { children: ReactNode }) => {
  const { projectInfo, isLoading: isLoadingProject } = useProjectInfo()
  const { isLoading: isLoadingResources } = usePreloadResources()

  const supportedChainIds = useMemo(
    () => projectInfo?.web3Info?.map((v) => v.chainId) || [],
    [projectInfo?.web3Info]
  )
  const supportedChains = useMemo(
    () => customChains.filter((v) => supportedChainIds.includes(v.id)) || [],
    [supportedChainIds]
  )

  const config = createConfig({
    chains: [merlinTestnet, ...supportedChains],
    transports: {
      [merlinTestnet.id]: http(),
      [merlinMainnet.id]: http()
    }
  })

  if (isLoadingProject || isLoadingResources) return <LoadingPage isLoading />

  return <WagmiProvider config={config}>{children}</WagmiProvider>
}

export default CustomWagmiProvider
