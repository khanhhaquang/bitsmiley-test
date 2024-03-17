import { Hash, formatEther } from 'viem'

import { commonParam } from '@/config/settings'
import { useReadOracleGetPrice } from '@/contracts/Oracle'

import { useContractAddresses } from './useContractAddresses'

export const useTokenPrice = (tokenId: Hash = commonParam.BTC) => {
  const contractAddresses = useContractAddresses()

  const { data } = useReadOracleGetPrice({
    address: contractAddresses?.oracle,
    args: [tokenId],
    query: {
      refetchInterval: 5 * 1000
    }
  })

  return data ? Number(formatEther(data)) : 0
}
