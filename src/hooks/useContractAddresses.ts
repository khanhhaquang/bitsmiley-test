import { useChainId } from 'wagmi'

import { useProjectInfo } from './useProjectInfo'

export const useContractAddresses = () => {
  const chainId = useChainId()
  const { projectInfo } = useProjectInfo()
  const contractAddresses = projectInfo?.web3Info.find(
    (v) => v.chainId === chainId
  )?.contract

  return contractAddresses
}
