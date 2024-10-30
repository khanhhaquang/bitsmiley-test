import { useParams } from 'react-router-dom'
import { Address, formatEther } from 'viem'

import { useReadOracleGetPrice } from '@/contracts/Oracle'
import { useContractAddresses } from '@/hooks/useContractAddresses'

export const useTokenPrice = () => {
  const { collateralId } = useParams()
  const contractAddresses = useContractAddresses()

  const { data } = useReadOracleGetPrice({
    address: contractAddresses?.oracle,
    args: (collateralId as Address) && [collateralId as Address],
    query: {
      refetchInterval: 5 * 1000
    }
  })

  return data ? Number(formatEther(data)) : 0
}
