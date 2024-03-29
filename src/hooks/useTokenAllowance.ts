import { Address, formatEther, erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'

import { useUserInfo } from '@/hooks/useUserInfo'

export const useTokenAllowance = (contract?: Address, spender?: Address) => {
  const { address } = useUserInfo()
  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isLoadingAllowance,
    ...rest
  } = useReadContract({
    abi: erc20Abi,
    functionName: 'allowance',
    address: contract,
    args: spender && address && [address, spender],
    query: { select: (res) => (!res ? 0 : Number(formatEther(res))) }
  })

  return { allowance, refetchAllowance, isLoadingAllowance, ...rest }
}
