import { useMemo } from 'react'
import { useChainId } from 'wagmi'

import { useProjectInfo } from './useProjectInfo'

export const useContractAddresses = (injectChainId?: number) => {
  const chainId = useChainId()
  const { evmChains, suiChains } = useProjectInfo()

  const evmContractAddresses = useMemo(
    () => evmChains?.find((v) => v.chainId === chainId)?.contract,
    [chainId, evmChains]
  )

  const suiContractAddresses = useMemo(
    () => suiChains?.find((v) => v.chainId === injectChainId)?.contract,
    [injectChainId, suiChains]
  )

  return { evmContractAddresses, suiContractAddresses }
}
