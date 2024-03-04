import { commonParam } from '@/config/settings'

import {
  useReadVaultManagerGetVaultChange,
  useReadVaultManagerCollateralTypes
} from '@/contracts/vaultManager'

import useContractAddresses from './useNetworkAddresses'
// import { useUserInfo } from './useUserInfo'
import { utilsParseEther } from '@/ethersConnect'
import useGetUservault from './useGetUservault'

const useUserVultManager = (amount) => {
  const contractAddresses = useContractAddresses()
  // const { address } = useUserInfo()
  // const { vault1 } = '1'
  const { vault1 } = useGetUservault()
  console.log('vault1--->', vault1)
  const bitUSDAmount = utilsParseEther(amount.toString())
  const { data: vaultManagerData } = useReadVaultManagerGetVaultChange({
    address: contractAddresses?.VaultManager,
    args: [
      commonParam.BTC,
      vault1,
      0,
      bitUSDAmount,
      commonParam.safeRate * 10000000
    ]
  })

  const { data: vaultManagerDataInit, refetch: refetchVaultManagerData } =
    useReadVaultManagerGetVaultChange({
      address: contractAddresses?.VaultManager,
      args: [commonParam.BTC, vault1, 0, 0, commonParam.safeRate * 10000000]
    })

  const { data: collateralTypes } = useReadVaultManagerCollateralTypes({
    address: contractAddresses?.VaultManager,
    args: [commonParam.BTC]
  })

  console.log(vaultManagerDataInit)
  return {
    vaultManagerData,
    vaultManagerDataInit,
    collateralTypes,
    refetchVaultManagerData
  }
}

export default useUserVultManager
