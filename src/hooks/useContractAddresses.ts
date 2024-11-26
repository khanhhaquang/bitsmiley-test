// import { useChainId } from 'wagmi'

import { useProjectInfo } from './useProjectInfo'

export const useContractAddresses = () => {
  // const chainId = useChainId() // to do
  const mockChainId = 103
  const { projectInfo } = useProjectInfo()
  const contractAddresses = projectInfo?.web3Info.find(
    (v) => v.chainId === mockChainId
  )?.contract

  return contractAddresses
}
