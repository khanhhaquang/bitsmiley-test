import { useParams } from 'react-router-dom'
import { Address, formatEther } from 'viem'

import { useReadOracleGetPrice } from '@/contracts/Oracle'

import { useContractAddresses } from './useContractAddresses'

export const useTokenPrice = (address?: Address) => {
  const { collateralId } = useParams()
  const contractAddresses = useContractAddresses()

  const tokenAddress: Address = collateralId || address

  const { data } = useReadOracleGetPrice({
    address: contractAddresses?.oracle,
    args: tokenAddress && [tokenAddress],
    query: {
      refetchInterval: 5 * 1000
    }
  })

  return data ? Number(formatEther(data)) : 0
}
