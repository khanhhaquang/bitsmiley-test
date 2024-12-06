import { useReadRegisterBeneficiaries } from '@/contracts/Register'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useUserInfo } from '@/hooks/useUserInfo'

export const useRegister = () => {
  const { address } = useUserInfo()
  const { evmContractAddresses } = useContractAddresses()
  const {
    data: airdropState,
    refetch: refetchAirdropState,
    isLoading: isLoadingAirdropState,
    isFetching: isFetchingAirdropState
  } = useReadRegisterBeneficiaries({
    address: evmContractAddresses?.register,
    args: address && [address]
  })
  return {
    airdropState,
    refetchAirdropState,
    isLoadingAirdropState,
    isFetchingAirdropState
  }
}
