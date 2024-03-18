import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { formatEther, parseEther } from 'viem'

import { commonParam } from '@/config/settings'
import { useReadBitSmileyOwners } from '@/contracts/BitSmiley'
import { useReadVaultGetVaultChange } from '@/contracts/Vault'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useDebounce } from '@/hooks/useDebounce'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IVaultFromChain } from '@/types/vault'

export const useUserVault = () => {
  const { address } = useUserInfo()
  const contractAddresses = useContractAddresses()

  const bitSmileyAddress = contractAddresses?.BitSmiley
  const vaultManagerAddress = contractAddresses?.VaultManager

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
    ...rest
  } = useReadVaultGetVaultChange({
    address: vaultManagerAddress,
    args: vaultAddress && [
      commonParam.BTC,
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
  } = useReadVaultGetVaultChange({
    address: vaultManagerAddress,
    args:
      vaultAddress && hasChangedVault
        ? [
            commonParam.BTC,
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
  } = useReadVaultGetVaultChange({
    address: vaultManagerAddress,
    args: vaultAddress
      ? [
          commonParam.BTC,
          vaultAddress,
          parseEther(debouncedMaxVaultCollateral),
          parseEther(debouncedMaxVaultBitUsd),
          commonParam.safeRate
        ]
      : undefined,
    query
  })

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
    isFetchingVaultAddress
  }
}
