import { useReadRegiterBeneficiaries } from '@/contracts/Regiter'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useUserInfo } from '@/hooks/useUserInfo'

export const useRegiter = () => {
  const { address } = useUserInfo()
  const contractAddresses = useContractAddresses()
  const {
    data: airdropState,
    refetch: refetchAirdropState,
    isFetching: isFetchingAirdropState
  } = useReadRegiterBeneficiaries({
    address: contractAddresses?.register,
    args: address && [address]
  })
  return {
    airdropState,
    refetchAirdropState,
    isFetchingAirdropState
  }
}
