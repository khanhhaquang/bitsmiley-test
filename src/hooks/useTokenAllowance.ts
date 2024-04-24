import { Address, formatEther } from 'viem'

import { useReadErc20Allowance } from '@/contracts/ERC20'
import { useUserInfo } from '@/hooks/useUserInfo'

export const useTokenAllowance = (contract?: Address, spender?: Address) => {
  const { address } = useUserInfo()
  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isLoadingAllowance,
    ...rest
  } = useReadErc20Allowance({
    address: contract,
    args: spender && address && [address, spender],
    query: { select: (res) => (!res ? 0 : Number(formatEther(res))) }
  })

  return { allowance, refetchAllowance, isLoadingAllowance, ...rest }
}
