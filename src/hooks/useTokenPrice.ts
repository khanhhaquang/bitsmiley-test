import { useParams } from 'react-router-dom'
import { Address, formatEther } from 'viem'

import { useReadOracleGetPrice } from '@/contracts/Oracle'
import { useContractAddresses } from '@/hooks/useContractAddresses'

export const useTokenPrice = (injectedCollateralId: string = '') => {
  const { collateralId } = useParams()
  const { evmContractAddresses } = useContractAddresses()

  const expectedCollateralId = collateralId || injectedCollateralId

  const { data } = useReadOracleGetPrice({
    address: evmContractAddresses?.oracle,
    args: (expectedCollateralId as Address) && [
      expectedCollateralId as Address
    ],
    query: {
      refetchInterval: 5 * 1000
    }
  })

  return data ? Number(formatEther(data)) : 0
}
