import { useChainId } from 'wagmi'

import { useProjectInfo } from './useProjectInfo'

export const useContractAddresses = () => {
  const chainId = useChainId()
  const { evmChains } = useProjectInfo()
  const contractAddresses = evmChains?.find((v) => v.chainId === chainId)
    ?.contract

  return contractAddresses
}
