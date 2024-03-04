import {
  useReadBitUsdContractAllowance,
  useReadBitUsdContractBalanceOf
} from '@/contracts/BitUSDContract'

import useContractAddresses from './useNetworkAddresses'
import { useUserInfo } from './useUserInfo'

const useBitUSDContract = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()
  if (!address) return null
  if (!contractAddresses?.BitSmiley) return null
  
  const { data: isBitUSDAllowance, refetch: refetchisBitUSDAllowance } =
    useReadBitUsdContractAllowance({
      address: contractAddresses?.BitUSDL2,
      args: [address, contractAddresses?.BitSmiley]
    })
  console.log(isBitUSDAllowance)

  const { data: gitBalanceBitUSD, refetch: refetchBalanceBitUSD } =
    useReadBitUsdContractBalanceOf({
      address: contractAddresses?.BitUSDL2,
      args: [address]
    })

  return {
    isBitUSDAllowance,
    refetchisBitUSDAllowance,
    gitBalanceBitUSD,
    refetchBalanceBitUSD
  }
}

export default useBitUSDContract
