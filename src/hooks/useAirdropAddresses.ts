import { useChainId } from 'wagmi'

import { useProjectInfo } from './useProjectInfo'

export const useAirdropAddresses = () => {
  const chainId = useChainId()
  const { projectInfo } = useProjectInfo()
  const airdropAddresses = projectInfo?.web3Info.find(
    (v) => v.chainId === chainId
  )?.contract.airdrop

  return airdropAddresses
}
