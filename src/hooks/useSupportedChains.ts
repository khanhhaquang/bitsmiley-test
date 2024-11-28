import { useMemo } from 'react'
import { Chain, createClient, http } from 'viem'

import { customChains } from '@/config/wagmi'
import { useProjectInfo } from '@/hooks/useProjectInfo'

export const useSupportedChains = () => {
  const { projectInfo, isLoading } = useProjectInfo()
  const supportedChainIds = useMemo(
    () => projectInfo?.web3Info?.map((v) => v.chainId) || [],
    [projectInfo?.web3Info]
  )

  const supportedChains = useMemo(
    () => customChains.filter((v) => supportedChainIds.includes(v.id)) || [],
    [supportedChainIds]
  )

  const clients = useMemo(
    () =>
      supportedChains.map((c) =>
        createClient({
          chain: c as Chain,
          transport: http()
        })
      ),
    [supportedChains]
  )
  console.log('🚀 ~ useSupportedChains ~ clients:', clients)

  return { supportedChainIds, supportedChains, isLoading, clients }
}
