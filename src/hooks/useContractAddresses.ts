import { useChainId } from 'wagmi'

import { useProjectInfo } from './useProjectInfo'

export const useContractAddresses = (injectChainId?: number) => {
  const chainId = useChainId() // to do
  const { projectInfo } = useProjectInfo()
  const contractAddresses = projectInfo?.web3Info.find(
    (v) => v.chainId === (injectChainId ?? chainId)
  )?.contract

  return contractAddresses
}
