import { commonParam } from '@/config/settings'

import {
  useReadVaultManagerGetVaultChange,
  useReadVaultManagerCollateralTypes
} from '@/contracts/vaultManager'

import useContractAddresses from './useNetworkAddresses'
import useGetUservault from './useGetUservault'
import { parseEther } from 'viem'

const useUserVultManager = (amount: number) => {
  const contractAddresses = useContractAddresses()
  const { vault1 } = useGetUservault()
  console.log('vault1--->', vault1)
  const bitUSDAmount = parseEther(amount.toString())
  const { data: vaultManagerData } = useReadVaultManagerGetVaultChange({
    address: contractAddresses?.VaultManager,
    args: vault1 && [
      commonParam.BTC,
      vault1,
      BigInt(0),
      bitUSDAmount,
      BigInt(commonParam.safeRate * 10000000)
    ]
  })

  const { data: vaultManagerDataInit, refetch: refetchVaultManagerData } =
    useReadVaultManagerGetVaultChange({
      address: contractAddresses?.VaultManager,
      args: vault1 && [
        commonParam.BTC,
        vault1,
        BigInt(0),
        BigInt(0),
        BigInt(commonParam.safeRate * 10000000)
      ]
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
