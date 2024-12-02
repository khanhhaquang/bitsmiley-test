import { useMemo } from 'react'
import { Chain, createClient, http } from 'viem'

import { customChains } from '@/config/wagmi'
import { useProjectInfo } from '@/hooks/useProjectInfo'

export const useSupportedChains = () => {
  const { evmChains, suiChains, isLoading } = useProjectInfo()

  const supportedChainIds = useMemo(
    () =>
      [...(evmChains || []), ...(suiChains || [])]?.map((v) => v.chainId) || [],
    [evmChains, suiChains]
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

  return { supportedChainIds, supportedChains, isLoading, clients }
}
