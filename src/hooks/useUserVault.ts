import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { formatEther, parseEther } from 'viem'

import { commonParam } from '@/config/settings'
import {
  useReadBitSmileyOwners,
  useReadBitSmileyGetVaultChange
} from '@/contracts/BitSmiley'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useDebounce } from '@/hooks/useDebounce'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IVaultFromChain } from '@/types/vault'

export const useUserVault = () => {
  const { address } = useUserInfo()
  const contractAddresses = useContractAddresses()

  const bitSmileyAddress = contractAddresses?.BitSmiley

  const {
    data: vaultAddress,
    refetch: refetchVaultAddress,
    isFetching: isFetchingVaultAddress
  } = useReadBitSmileyOwners({
    address: bitSmileyAddress,
    args: address && [address],
    query: { select: (res) => res?.[0] }
  })

  const query = {
    placeholderData: keepPreviousData,
    select: (res?: IVaultFromChain) => ({
      liquidationPrice: !res?.liquidationPrice
        ? ''
        : formatEther(res.liquidationPrice),
      healthFactor: !res?.healthFactor
        ? ''
        : ((Number(res.healthFactor) / 1000) * 100).toString(),
      debtBitUSD: !res?.debtBitUSD ? '' : formatEther(res.debtBitUSD),
      lockedCollateral: !res?.lockedCollateral
        ? ''
        : formatEther(res.lockedCollateral),
      availableToWithdraw: !res?.availableToWithdraw
        ? ''
        : formatEther(res.availableToWithdraw),
      availableToMint: !res?.availableToMint
        ? ''
        : formatEther(res.availableToMint)
    })
  }

  const {
    data: vault,
    refetch: refetchVault,
    isFetching: isFetchingVault,
    ...rest
  } = useReadBitSmileyGetVaultChange({
    address: bitSmileyAddress,
    args: vaultAddress && [
      vaultAddress,
      parseEther('0'),
      parseEther('0'),
      commonParam.safeRate
    ],
    query
  })

  const [changedBitUsd, setChangedBitUsd] = useState('')
  const [changedCollateral, setChangedCollateral] = useState('')

  const debouncedChangedBitUsd = useDebounce(changedBitUsd)
  const debouncedChangedCollateral = useDebounce(changedCollateral)
  const hasChangedVault =
    !!debouncedChangedBitUsd || !!debouncedChangedCollateral

  const {
    data: changedVault,
    refetch: refetchChangedVault,
    isFetching: isFetchingChangedVault
  } = useReadBitSmileyGetVaultChange({
    address: bitSmileyAddress,
    args:
      vaultAddress && hasChangedVault
        ? [
            vaultAddress,
            parseEther(debouncedChangedCollateral),
            parseEther(debouncedChangedBitUsd),
            commonParam.safeRate
          ]
        : undefined,
    query
  })

  const [maxVaultBitUsd, setMaxVaultBitUsd] = useState('')
  const [maxVaultCollateral, setMaxVaultCollateral] = useState('')

  const debouncedMaxVaultBitUsd = useDebounce(maxVaultBitUsd)
  const debouncedMaxVaultCollateral = useDebounce(maxVaultCollateral)

  const {
    data: maxVault,
    refetch: refetchMaxVault,
    isFetching: isFetchingMaxVault
  } = useReadBitSmileyGetVaultChange({
    address: bitSmileyAddress,
    args: vaultAddress
      ? [
          vaultAddress,
          parseEther(debouncedMaxVaultCollateral),
          parseEther(debouncedMaxVaultBitUsd),
          commonParam.safeRate
        ]
      : undefined,
    query
  })

  const {
    refetchAllowance: refetchWbtcAllowance,
    isFetching: isFetchingWbtcAllowance
  } = useTokenAllowance(contractAddresses?.WBTC, contractAddresses?.BitSmiley)
  const {
    refetchAllowance: refetchBitUsdAllowance,
    isFetching: isFetchingBitUsdAllowance
  } = useTokenAllowance(
    contractAddresses?.BitUSDL2,
    contractAddresses?.BitSmiley
  )
  const {
    refetchBalance: refetchWbtcBalance,
    isFetching: isFetchingWbtcBalance
  } = useTokenBalance(contractAddresses?.WBTC)
  const {
    refetchBalance: refetchBitUsdBalance,
    isFetching: isFetchingBitUsdBalance
  } = useTokenBalance(contractAddresses?.BitUSDL2)

  const isRefreshingVaultValues =
    isFetchingVaultAddress ||
    isFetchingVault ||
    isFetchingMaxVault ||
    isFetchingChangedVault ||
    isFetchingBitUsdBalance ||
    isFetchingWbtcBalance ||
    isFetchingWbtcAllowance ||
    isFetchingBitUsdAllowance
  const refreshVaultValues = () => {
    refetchVaultAddress()
    refetchVault()
    refetchMaxVault()
    refetchChangedVault()
    refetchWbtcAllowance()
    refetchWbtcBalance()
    refetchBitUsdAllowance()
    refetchBitUsdBalance()
  }

  return {
    vault,
    ...rest,
    refetchVaultAddress,
    refetchVault,
    changedVault,
    setChangedBitUsd,
    setChangedCollateral,
    hasChangedVault,
    maxVault,
    setMaxVaultBitUsd,
    setMaxVaultCollateral,
    refetchChangedVault,
    refetchMaxVault,
    isFetchingChangedVault,
    isFetchingMaxVault,
    isFetchingVaultAddress,
    refreshVaultValues,
    isRefreshingVaultValues
  }
}
