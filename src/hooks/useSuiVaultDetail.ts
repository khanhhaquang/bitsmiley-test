import { Transaction } from '@mysten/sui/transactions'
import { fromHex } from '@mysten/sui/utils'
import { useWallet } from '@suiet/wallet-kit'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useDebounce } from '@/hooks/useDebounce'
import {
  BcsOpenVault,
  BcsVaultDetail,
  IBcsVaultDetail,
  IDetailedSuiCollateral
} from '@/types/sui'
import { IVault } from '@/types/vault'
import { getSuiChainConfig } from '@/utils/chain'
import { formatNumberAsTrunc } from '@/utils/number'
import {
  convertToMist,
  fromMistToSignValue,
  parseFromMist,
  toI64
} from '@/utils/sui'

import { useSuiExecute } from './useSuiExecute'
import { useSuiToken } from './useSuiToken'
import { useSuiVaultAddress } from './useSuiVaultAddress'

const SAFE_BITUSD_DEDUCT_AMOUNT = 0.01

export const useSuiVaultDetail = (collateral?: IDetailedSuiCollateral) => {
  const { address, chain } = useWallet()
  const { fetchTransactionResult } = useSuiExecute()
  const { suiContractAddresses } = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )

  const PackageIds = useMemo(() => suiContractAddresses, [suiContractAddresses])

  const collateralType = collateral?.collateral?.tokenAddress
  const bitUSDType = `${suiContractAddresses?.bitUSDPackageId}::bitusd::BITUSD`

  const {
    coinMetadata: collateralMetaData,
    refetchBalance: refetchWbtcBalance,
    isFetching: isFetchingWbtcBalance
  } = useSuiToken(collateralType)
  const {
    coinMetadata: bitUSDMetadata,
    refetchBalance: refetchBitUsdBalance,
    isFetching: isFetchingBitUsdBalance
  } = useSuiToken(bitUSDType)

  const {
    vaultAddress,
    refetch: refetchVaultAddress,
    isFetching: isFetchingVaultAddress
  } = useSuiVaultAddress()

  const getVaultDetail = async (
    collateralAmount: string,
    bitusd: string,
    vault: string = ''
  ) => {
    console.log(
      '🚀 ~ useSuiVaultDetail ~ bitusd:',
      convertToMist(bitusd, collateralMetaData?.decimals ?? 0)
    )

    if (!PackageIds || !address) return undefined

    const tx = new Transaction()
    tx.moveCall({
      target: `${PackageIds.bitSmileyPackageId}::query::get_vault_detail`,
      arguments: [
        tx.object(PackageIds.bitSmileyQueryObjectId),
        tx.object(PackageIds.bitSmileyObjectId),
        tx.object(PackageIds.vaultManagerObjectId),
        tx.object(PackageIds.stabilityFeeObjectId),
        tx.object(PackageIds.oracleObjectId),
        tx.pure.address(vault),
        tx.pure(
          toI64(
            convertToMist(collateralAmount, collateralMetaData?.decimals ?? 0)
          )
        ),
        tx.pure(toI64(convertToMist(bitusd, bitUSDMetadata?.decimals ?? 0))),
        tx.object.clock()
      ]
    })

    const res = await fetchTransactionResult(tx)

    if (!res || res.length === 0) return undefined

    return BcsVaultDetail.parse(new Uint8Array(res))
  }

  const query = {
    placeholderData: keepPreviousData,
    select: (data: Partial<IBcsVaultDetail> | undefined): IVault => {
      return {
        healthFactor: data?.health_factor
          ? (Number(data?.health_factor) / 10).toString()
          : '',
        liquidationPrice: parseFromMist(
          data?.liquidation_price || 0
        ).toString(),
        debtBitUSD: fromMistToSignValue(
          data?.debt?.value || 0,
          data?.debt?.is_negative
        ).toString(),
        fee: parseFromMist(data?.fee || 0).toString(),
        mintedBitUSD: parseFromMist(data?.minted_bitusd || 0),
        availableToMint: Math.max(
          Number(fromMistToSignValue(data?.available_to_mint?.value || 0)) -
            SAFE_BITUSD_DEDUCT_AMOUNT,
          0
        ).toString(),
        availableToWithdraw: fromMistToSignValue(
          data?.available_to_withdraw?.value || 0,
          data?.available_to_withdraw?.is_negative,
          collateral?.collateral?.decimals ?? 0
        ).toString(),
        lockedCollateral: fromMistToSignValue(
          data?.locked_collateral?.value || 0,
          data?.locked_collateral?.is_negative,
          collateral?.collateral?.decimals ?? 0
        ).toString()
      }
    }
  }

  const {
    data: vault,
    refetch: refetchVault,
    isFetching: isFetchingVault,
    ...rest
  } = useQuery({
    queryKey: [
      'sui-vault-details',
      vaultAddress,
      '0',
      '0',
      bitUSDMetadata?.decimals,
      collateralMetaData?.decimals
    ],
    queryFn: () => getVaultDetail('0', '0', vaultAddress),
    enabled: Boolean(
      PackageIds?.bitSmileyPackageId &&
        PackageIds?.bitSmileyObjectId &&
        address &&
        vaultAddress
    ),
    placeholderData: query.placeholderData,
    select: query.select
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
  } = useQuery({
    queryKey: [
      'sui-debounced-vault-details',
      vaultAddress,
      debouncedChangedCollateral,
      debouncedChangedBitUsd,
      bitUSDMetadata?.decimals,
      collateralMetaData?.decimals
    ],
    queryFn: () =>
      getVaultDetail(
        debouncedChangedCollateral,
        debouncedChangedBitUsd,
        vaultAddress
      ),
    enabled: Boolean(
      PackageIds?.bitSmileyPackageId &&
        PackageIds?.bitSmileyObjectId &&
        address &&
        vaultAddress &&
        hasChangedVault
    ),
    placeholderData: query.placeholderData,
    select: query.select
  })

  const [maxVaultBitUsd, setMaxVaultBitUsd] = useState('')
  const [maxVaultCollateral, setMaxVaultCollateral] = useState('')

  const debouncedMaxVaultBitUsd = useDebounce(maxVaultBitUsd)
  const debouncedMaxVaultCollateral = useDebounce(maxVaultCollateral)

  const {
    data: maxVaultData,
    refetch: refetchMaxVault,
    isFetching: isFetchingMaxVault
  } = useQuery({
    queryKey: [
      'sui-max-vault-details',
      vaultAddress,
      debouncedMaxVaultCollateral,
      debouncedMaxVaultBitUsd,
      bitUSDMetadata?.decimals,
      collateralMetaData?.decimals
    ],
    queryFn: () =>
      getVaultDetail(
        debouncedMaxVaultCollateral,
        debouncedMaxVaultBitUsd,
        vaultAddress
      ),
    enabled: Boolean(
      PackageIds?.bitSmileyPackageId &&
        PackageIds?.bitSmileyObjectId &&
        address &&
        vaultAddress
    ),
    placeholderData: query.placeholderData,
    select: query.select
  })

  const maxVault = useMemo(
    () => ({
      ...maxVaultData,
      availableToMint: formatNumberAsTrunc(maxVaultData?.availableToMint || '')
    }),
    [maxVaultData]
  )

  const { collateralId = '' } = useParams()
  const [capturedMaxMint, setCapturedMaxMint] = useState('')
  const [tryOpenVaultBitUsd, setTryOpenVaultBitUsd] = useState('')
  const [tryOpenVaultCollateral, setTryOpenVaultCollateral] = useState('')

  const debouncedTryOpenVaultBitUsd = useDebounce(tryOpenVaultBitUsd)
  const debouncedTryOpenVaultCollateral = useDebounce(tryOpenVaultCollateral)

  const tryOpenVault = async (
    collateralId: string,
    collateral: number,
    bitusd: number
  ) => {
    if (!PackageIds || !address) return undefined

    const tx = new Transaction()
    const collateralMist = convertToMist(
      Number(collateral),
      collateralMetaData?.decimals ?? 0
    )
    const bitusdMist = convertToMist(
      Number(bitusd),
      bitUSDMetadata?.decimals ?? 0
    )
    tx.moveCall({
      target: `${PackageIds.bitSmileyPackageId}::query::try_open_vault`,
      arguments: [
        tx.object(PackageIds?.bitSmileyQueryObjectId),
        tx.object(PackageIds?.vaultManagerObjectId),
        tx.object(PackageIds?.oracleObjectId),
        tx.pure.vector('u8', fromHex(collateralId)),
        tx.pure(toI64(collateralMist)),
        tx.pure(toI64(bitusdMist))
      ]
    })

    const res = await fetchTransactionResult(tx)
    if (!res || res.length === 0) return undefined

    return BcsOpenVault.parse(new Uint8Array(res))
  }

  const { data: tryOpenVaultInfo } = useQuery({
    queryKey: [
      'sui-try-open-vault',
      collateralId,
      debouncedTryOpenVaultCollateral,
      debouncedTryOpenVaultBitUsd,
      bitUSDMetadata?.decimals
    ],
    queryFn: () =>
      tryOpenVault(
        collateralId,
        Number(debouncedTryOpenVaultCollateral),
        Number(debouncedTryOpenVaultBitUsd)
      ),
    enabled: Boolean(
      suiContractAddresses?.bitSmileyPackageId && address && collateralId
    ),
    placeholderData: query.placeholderData,
    select: query.select
  })

  useEffect(() => {
    if (!debouncedTryOpenVaultBitUsd || !Number(debouncedTryOpenVaultBitUsd)) {
      if (tryOpenVaultInfo?.availableToMint) {
        setCapturedMaxMint(tryOpenVaultInfo?.availableToMint)
      }
    }
  }, [debouncedTryOpenVaultBitUsd, tryOpenVaultInfo?.availableToMint])

  const isRefreshingVaultValues =
    isFetchingVaultAddress ||
    isFetchingVault ||
    isFetchingMaxVault ||
    isFetchingChangedVault ||
    isFetchingBitUsdBalance ||
    isFetchingWbtcBalance

  const refreshVaultValues = () => {
    refetchVaultAddress()
    refetchVault()
    refetchMaxVault()
    refetchChangedVault()
    refetchWbtcBalance()
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
