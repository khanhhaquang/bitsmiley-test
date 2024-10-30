import { Address, formatEther } from 'viem'

import { useReadErc20BalanceOf } from '@/contracts/ERC20'

import { useUserInfo } from './useUserInfo'

export const useTokenBalance = (tokenAddress?: Address) => {
  const { address } = useUserInfo()

  const {
    data: balance,
    refetch: refetchBalance,
    ...rest
  } = useReadErc20BalanceOf({
    address: tokenAddress,
    args: address && [address],
    query: { select: (res) => (res ? Number(formatEther(res)) : 0) }
  })

  return { balance: balance ?? 0, refetchBalance, ...rest }
}
