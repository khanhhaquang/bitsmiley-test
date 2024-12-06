import { keepPreviousData } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Address, formatEther, parseEther } from 'viem'

import { useReadBitSmileyOwners } from '@/contracts/BitSmiley'
import {
  useReadBitSmileyQueryGetVaultDetail,
  useReadBitSmileyQueryTryOpenVault
} from '@/contracts/BitSmileyQuery'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useDebounce } from '@/hooks/useDebounce'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IDetailedCollateral, IVault, IVaultFromChain } from '@/types/vault'
import { formatNumberAsTrunc } from '@/utils/number'

export const useVaultDetail = (collateral?: IDetailedCollateral) => {
  const { address } = useUserInfo()
  const { evmContractAddresses } = useContractAddresses()

  const bitSmileyAddress = evmContractAddresses?.BitSmiley
  const bitSmileyQueryAddress =
    evmContractAddresses?.bitSmileyQuery || undefined
  const collateralTokenAddress = collateral?.collateral?.tokenAddress

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
    select: (res?: Partial<IVaultFromChain>): IVault => ({
      liquidationPrice: !res?.liquidationPrice
        ? ''
        : formatEther(res.liquidationPrice),
      healthFactor: !res?.healthFactor
        ? ''
        : (Number(res.healthFactor) / 10).toString(),
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
    data: maxVaultData,
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

  const maxVault = useMemo(
    () => ({
      ...maxVaultData,
      availableToMint: formatNumberAsTrunc(maxVaultData?.availableToMint || '')
    }),
    [maxVaultData]
  )

  const { collateralId } = useParams()
  const [capturedMaxMint, setCapturedMaxMint] = useState('')
  const [tryOpenVaultBitUsd, setTryOpenVaultBitUsd] = useState('')
  const [tryOpenVaultCollateral, setTryOpenVaultCollateral] = useState('')

  const debouncedTryOpenVaultBitUsd = useDebounce(tryOpenVaultBitUsd)
  const debouncedTryOpenVaultCollateral = useDebounce(tryOpenVaultCollateral)

  const { data: tryOpenVaultInfo } = useReadBitSmileyQueryTryOpenVault({
    address: bitSmileyQueryAddress,
    args: collateralId
      ? [
          collateralId as Address,
          parseEther(debouncedTryOpenVaultCollateral),
          parseEther(debouncedTryOpenVaultBitUsd)
        ]
      : undefined,
    query
  })
  useEffect(() => {
    if (!debouncedTryOpenVaultBitUsd || !Number(debouncedTryOpenVaultBitUsd)) {
      if (tryOpenVaultInfo?.availableToMint) {
        setCapturedMaxMint(tryOpenVaultInfo.availableToMint)
      }
    }
  }, [debouncedTryOpenVaultBitUsd, tryOpenVaultInfo?.availableToMint])

  const {
    refetchAllowance: refetchWbtcAllowance,
    isFetching: isFetchingWbtcAllowance
  } = useTokenAllowance(collateralTokenAddress, evmContractAddresses?.BitSmiley)
  const {
    refetchAllowance: refetchBitUsdAllowance,
    isFetching: isFetchingBitUsdAllowance
  } = useTokenAllowance(
    evmContractAddresses?.BitUSDL2,
    evmContractAddresses?.BitSmiley
  )
  const {
    refetchBalance: refetchWbtcBalance,
    isFetching: isFetchingWbtcBalance
  } = useTokenBalance(collateralTokenAddress)
  const {
    refetchBalance: refetchBitUsdBalance,
    isFetching: isFetchingBitUsdBalance
  } = useTokenBalance(evmContractAddresses?.BitUSDL2)

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
    isRefreshingVaultValues,

    tryOpenVaultInfo,
    capturedMaxMint,
    setTryOpenVaultBitUsd,
    setTryOpenVaultCollateral
  }
}
