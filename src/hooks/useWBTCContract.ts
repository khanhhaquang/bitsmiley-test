import {
  useReadWbtcContractAllowance,
  useReadWbtcContractBalanceOf
} from '@/contracts/WBTCContract'

import useContractAddresses from './useNetworkAddresses'
import { useUserInfo } from './useUserInfo'

const useWBTCContract = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()

  const { data: isAllowance, refetch: refetchisAllowance } =
    useReadWbtcContractAllowance({
      address: contractAddresses?.WBTC,
      args: address &&
        contractAddresses?.BitSmiley && [address, contractAddresses?.BitSmiley]
    })

  const {
    data: isAllowanceVaultManager,
    refetch: refetchisAllowanceVaultManager
  } = useReadWbtcContractAllowance({
    address: contractAddresses?.WBTC,
    args: address &&
      contractAddresses?.BitSmiley && [address, contractAddresses?.BitSmiley]
  })
  console.log(isAllowanceVaultManager)

  const { data: gitBalanceWBTC, refetch: refetchBalanceWBTC } =
    useReadWbtcContractBalanceOf({
      address: contractAddresses?.WBTC,
      args: address && [address]
    })

  return {
    isAllowanceVaultManager,
    refetchisAllowanceVaultManager,
    isAllowance,
    gitBalanceWBTC,
    refetchBalanceWBTC,
    refetchisAllowance
  }
}

export default useWBTCContract
