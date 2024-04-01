import { useMemo } from 'react'

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

  return { supportedChainIds, supportedChains, isLoading }
}
