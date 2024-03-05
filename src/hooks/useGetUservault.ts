import { useReadSmileyContractOwners } from '@/contracts/smileyContract'

import useContractAddresses from './useNetworkAddresses'
import { useUserInfo } from './useUserInfo'

const useGetUservault = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()
  const { data: vault1, refetch: refetchVault1 } = useReadSmileyContractOwners({
    address: contractAddresses?.BitSmiley,
    args: address && [address]
  })
  return {
    vault1,
    refetchVault1
  }
}

export default useGetUservault
