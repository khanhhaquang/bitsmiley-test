import {
  useReadBitUsdContractAllowance,
  useReadBitUsdContractBalanceOf
} from '@/contracts/BitUSDContract'

import useContractAddresses from './useNetworkAddresses'
import { useUserInfo } from './useUserInfo'

const useBitUSDContract = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()

  const { data: isBitUSDAllowance, refetch: refetchisBitUSDAllowance } =
    useReadBitUsdContractAllowance({
      address: contractAddresses?.BitUSDL2,
      args: address &&
        contractAddresses?.BitSmiley && [address, contractAddresses?.BitSmiley]
    })
  // console.log(isBitUSDAllowance)

  const { data: gitBalanceBitUSD, refetch: refetchBalanceBitUSD } =
    useReadBitUsdContractBalanceOf({
      address: contractAddresses?.BitUSDL2,
      args: address && [address]
    })

  return {
    isBitUSDAllowance,
    refetchisBitUSDAllowance,
    gitBalanceBitUSD,
    refetchBalanceBitUSD
  }
}

export default useBitUSDContract
