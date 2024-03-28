import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { formatEther, parseEther } from 'viem'

import { useReadBitSmileyOwners } from '@/contracts/BitSmiley'
import { useReadBitSmileyQueryGetVaultDetail } from '@/contracts/BitSmileyQuery'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useDebounce } from '@/hooks/useDebounce'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IVault, IVaultFromChain } from '@/types/vault'

export const useUserVault = () => {
  const { address } = useUserInfo()
  const contractAddresses = useContractAddresses()

  const bitSmileyAddress = contractAddresses?.BitSmiley
  const bitSmileyQueryAddress = contractAddresses?.bitSmileyQuery || undefined

  const {
    data: vaultAddress,
    refetch: refetchVaultAddress,
    isFetching: isFetchingVaultAddress
  } = useReadBitSmileyOwners({
    address: bitSmileyAddress,
    args: address && [address]
  })

  const query = {
    placeholderData: keepPreviousData,
    select: (res?: IVaultFromChain): IVault => ({
      liquidationPrice: !res?.liquidationPrice
        ? ''
        : formatEther(res.liquidationPrice),
      healthFactor: !res?.healthFactor
        ? ''
        : ((Number(res.healthFactor) / 1000) * 100).toString(),
      debtBitUSD: !res?.debt ? '' : formatEther(res.debt),
      fee: !res?.fee ? '' : formatEther(res.fee),
      mintedBitUSD: !res?.mintedBitUSD ? '' : formatEther(res?.mintedBitUSD),
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
  } = useReadBitSmileyQueryGetVaultDetail({
    address: bitSmileyQueryAddress,
    args: vaultAddress && [vaultAddress, parseEther('0'), parseEther('0')],
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
  } = useReadBitSmileyQueryGetVaultDetail({
    address: bitSmileyQueryAddress,
    args:
      vaultAddress && hasChangedVault
        ? [
            vaultAddress,
            parseEther(debouncedChangedCollateral),
            parseEther(debouncedChangedBitUsd)
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
  } = useReadBitSmileyQueryGetVaultDetail({
    address: bitSmileyQueryAddress,
    args: vaultAddress
      ? [
          vaultAddress,
          parseEther(debouncedMaxVaultCollateral),
          parseEther(debouncedMaxVaultBitUsd)
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
