import { commonParam } from '@/config/settings'
import { useReadOracleContractGetPrice } from '@/contracts/oracleContract'

import useContractAddresses from './useNetworkAddresses'
// import { useUserInfo } from './useUserInfo'

const useGetOraclePrice = () => {
  const contractAddresses = useContractAddresses()
  // const { address } = useUserInfo()
  const { data: oraclePrice1, refetch: refetchOraclePrice1 } =
    useReadOracleContractGetPrice({
      address: contractAddresses?.oracle,
      args: [commonParam.BTC]
    })
  return {
    oraclePrice1,
    refetchOraclePrice1
  }
}

export default useGetOraclePrice
