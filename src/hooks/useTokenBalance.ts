import { Address, erc20Abi, formatEther } from 'viem'
import { useReadContract } from 'wagmi'

import { useUserInfo } from './useUserInfo'

export const useTokenBalance = (tokenAddress?: Address) => {
  const { address } = useUserInfo()

  const {
    data: balance,
    refetch: refetchBalance,
    ...rest
  } = useReadContract({
    abi: erc20Abi,
    functionName: 'balanceOf',
    address: tokenAddress,
    args: address && [address],
    query: { select: (res) => (res ? Number(formatEther(res)) : 0) }
  })

  return { balance: balance ?? 0, refetchBalance, ...rest }
}
