import { commonParam } from '@/config/settings'

import { useReadVaultManagerGetVaultChange } from '@/contracts/vaultManager'

import useContractAddresses from './useNetworkAddresses'
import useGetUservault from './useGetUservault'
import { parseEther } from 'viem'

const useUserVaultManager = (val: string, isDeposit: boolean, type: number) => {
  console.log(val)
  const contractAddresses = useContractAddresses()
  const { vault1 } = useGetUservault()
  const Ctype = type === 0 ? 0 : type === 1 ? 1 : type
  let amount: string = parseEther(val).toString()
  const safeRate = commonParam.safeRate // 50%
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parameter: any = []
  if (Ctype == 1) {
    amount == '0'
      ? amount
      : isDeposit
        ? (amount = (0 - Number(amount)).toString())
        : amount.toString()
    parameter = vault1 && [
      commonParam.BTC,
      vault1,
      BigInt(0),
      BigInt(amount),
      BigInt(safeRate * 10000000)
    ]
  } else {
    amount == '0'
      ? amount
      : !isDeposit
        ? (amount = (0 - Number(amount)).toString())
        : amount.toString()
    parameter = vault1 && [
      commonParam.BTC,
      vault1,
      BigInt(amount),
      BigInt(0),
      BigInt(safeRate * 10000000)
    ]
  }

  console.log(parameter)
  const { data: vaultManagerData, refetch: refetchVaultManagerData } =
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
  const { data: vaultManagerAfterData, refetch: refetchVaultManagerAfterData } =
    useReadVaultManagerGetVaultChange({
      address: contractAddresses?.VaultManager,
      args: parameter
    })
  console.log(vaultManagerAfterData)
  return {
    vaultManagerData,
    refetchVaultManagerData,
    vaultManagerAfterData,
    refetchVaultManagerAfterData
  }
}

export default useUserVaultManager
