import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
// import { getTransactions } from '@/store/common/reducer'
import { commonParam } from '@/config/settings'

import { useReadVaultManagerGetVaultChange } from '@/contracts/vaultManager'

import useContractAddresses from './useNetworkAddresses'
import { useUserInfo } from './useUserInfo'
import { utilsParseEther } from '@/ethersConnect'
import { getUservault } from './getUservault'

const useUserVultManager = (amount) => {
  console.log('--->', amount)
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()
  // const { vault1 } = '1'
  const { vault1 } = getUservault()
  // console.log('vault1--->',vault1)
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

  const { data: vaultManagerDataInit } = useReadVaultManagerGetVaultChange({
    address: contractAddresses?.VaultManager,
    args: [commonParam.BTC, vault1, 0, 0, commonParam.safeRate * 10000000]
  })

  return {
    vaultManagerData,
    vaultManagerDataInit
  }
}

export default useUserVultManager
