import { commonParam } from '@/config/settings'

import { useReadVaultManagerGetVaultChange } from '@/contracts/vaultManager'

import useContractAddresses from './useNetworkAddresses'
// import { useUserInfo } from './useUserInfo'
import { utilsParseEther } from '@/ethersConnect'
import useGetUservault from './useGetUservault'

const useUserVultManagerChange = (val: number, isDeposit, type: number) => {
  const contractAddresses = useContractAddresses()
  // const { address } = useUserInfo()
  // const { vault1 } = '1'
  const { vault1 } = useGetUservault()
  console.log('vault1--->', vault1)
  // const bitUSDAmount = utilsParseEther(amount.toString())
  const Ctype = type === 0 ? 0 : type === 1 ? 1 : type
  // if (Ctype == 1){
  //   valType = withdrawValue
  // }

  let amount: string = utilsParseEther(val.toString()).toString()
  const safeRate = commonParam.safeRate // 50%
  let parameter = []
  if (Ctype == 1) {
    amount == '0'
      ? amount
      : isDeposit
        ? (amount = '-' + amount.toString())
        : amount.toString()
    parameter = [commonParam.BTC, vault1, 0, amount, safeRate * 10000000]
  } else {
    amount == '0'
      ? amount
      : !isDeposit
        ? (amount = '-' + amount.toString())
        : amount.toString()
    parameter = [commonParam.BTC, vault1, amount, 0, safeRate * 10000000]
  }

  const { data: vaultManagerData, refetch: refetchVaultManagerData } =
    useReadVaultManagerGetVaultChange({
      address: contractAddresses?.VaultManager,
      args: [commonParam.BTC, vault1, 0, 0, commonParam.safeRate * 10000000]
    })

  console.log(parameter)
  const { data: vaultManagerAfterData, refetch: refetchVaultManagerAfterData } =
    useReadVaultManagerGetVaultChange({
      address: contractAddresses?.VaultManager,
      args: parameter
    })

  return {
    vaultManagerData,
    refetchVaultManagerData,
    vaultManagerAfterData,
    refetchVaultManagerAfterData
  }
}

export default useUserVultManagerChange
