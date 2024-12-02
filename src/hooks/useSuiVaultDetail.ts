import { SuiClient } from '@mysten/sui/client'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Address, hexToBytes } from 'viem'

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
import { convertToMist, parseFromMist, toI64 } from '@/utils/sui'

import { useSuiTokenBalance } from './useSuiTokenBalance'
import { useSuiVaultAddress } from './useSuiVaultAddress'

export const useSuiVaultDetail = (collateral?: IDetailedSuiCollateral) => {
  const suiClient = useSuiClient() as SuiClient
  const { account, chain } = useWallet()
  const contractAddresses = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )

  const {
    vaultAddress,
    refetch: refetchVaultAddress,
    isFetching: isFetchingVaultAddress
  } = useSuiVaultAddress()

  const getVaultDetail = async (
    collateral: string,
    bitusd: string,
    vault?: string
  ) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${contractAddresses?.bitSmileyPackageId}::query::get_vault_detail`,
      arguments: [
        tx.object(
          contractAddresses?.bitSmileyQueryObjectId as TransactionObjectInput
        ),
        tx.object(
          contractAddresses?.bitSmileyObjectId as TransactionObjectInput
        ),
        tx.object(
          contractAddresses?.vaultManagerObjectId as TransactionObjectInput
        ),
        tx.object(
          contractAddresses?.stabilityFeeObjectId as TransactionObjectInput
        ),
        tx.object(contractAddresses?.oracleObjectId as TransactionObjectInput),
        tx.pure.address(vault as Address),
        tx.pure(toI64(convertToMist(Number(collateral)))),
        tx.pure(toI64(convertToMist(Number(bitusd)))),
        tx.object.clock()
      ]
    })

    const res = await suiClient.devInspectTransactionBlock({
      sender: account?.address as Address,
      transactionBlock: tx
    })
    const bytes = res.results?.[0].returnValues?.[0]?.[0] || []
    return BcsVaultDetail.parse(new Uint8Array(bytes))
  }

  const query = {
    placeholderData: keepPreviousData,
    select: (data: Partial<IBcsVaultDetail>) =>
      ({
        liquidationPrice: parseFromMist(
          BigInt(data?.liquidation_price || 0)
        ).toString(),
        healthFactor: data?.health_factor,
        debtBitUSD: parseFromMist(
          BigInt(data?.debt?.value || 0)
          // data?.debt?.is_negative
        ).toString(),
        fee: parseFromMist(BigInt(data?.fee || 0)).toString(),
        mintedBitUSD: parseFromMist(
          BigInt(data?.minted_bitusd || 0)
        ).toString(),
        availableToMint: parseFromMist(
          BigInt(data?.available_to_mint?.value || 0)
          // data?.available_to_mint?.is_negative
        ).toString(),
        availableToWithdraw: parseFromMist(
          BigInt(data?.available_to_withdraw?.value || 0)
          // data?.available_to_withdraw?.is_negative
        ).toString(),
        lockedCollateral: parseFromMist(
          BigInt(data?.locked_collateral?.value || 0)
          // data?.locked_collateral?.is_negative
        ).toString()
      }) as IVault
  }

  const {
    data: vault,
    refetch: refetchVault,
    isFetching: isFetchingVault,
    ...rest
  } = useQuery({
    queryKey: ['sui-vault-details', vaultAddress, '0', '0'],
    queryFn: () => getVaultDetail('0', '0', vaultAddress),
    enabled: Boolean(
      contractAddresses?.bitSmileyPackageId &&
        contractAddresses?.bitSmileyObjectId &&
        account?.address &&
        suiClient &&
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
      debouncedChangedBitUsd
    ],
    queryFn: () =>
      getVaultDetail(
        debouncedChangedCollateral,
        debouncedChangedBitUsd,
        vaultAddress
      ),
    enabled: Boolean(
      contractAddresses?.bitSmileyPackageId &&
        contractAddresses?.bitSmileyObjectId &&
        account?.address &&
        suiClient &&
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
      debouncedMaxVaultBitUsd
    ],
    queryFn: () =>
      getVaultDetail(
        debouncedMaxVaultCollateral,
        debouncedMaxVaultBitUsd,
        vaultAddress
      ),
    enabled: Boolean(
      contractAddresses?.bitSmileyPackageId &&
        contractAddresses?.bitSmileyObjectId &&
        account?.address &&
        suiClient &&
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

  const { collateralId } = useParams()
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
    const tx = new Transaction()
    const collateralMist = convertToMist(Number(collateral))
    const bitusdMist = convertToMist(Number(bitusd))
    tx.moveCall({
      target: `${contractAddresses?.bitSmileyPackageId}::query::try_open_vault`,
      arguments: [
        tx.object(
          contractAddresses?.bitSmileyQueryObjectId as TransactionObjectInput
        ),
        tx.object(
          contractAddresses?.vaultManagerObjectId as TransactionObjectInput
        ),
        tx.object(contractAddresses?.oracleObjectId as TransactionObjectInput),
        tx.pure.vector('u8', hexToBytes(collateralId as Address)),
        tx.pure(toI64(collateralMist)),
        tx.pure(toI64(bitusdMist))
      ]
    })

    const res = await suiClient.devInspectTransactionBlock({
      sender: account?.address as Address,
      transactionBlock: tx
    })

    const bytes = res.results?.[0].returnValues?.[0]?.[0] || []
    return BcsOpenVault.parse(new Uint8Array(bytes))
  }

  const { data: tryOpenVaultInfo } = useQuery({
    queryKey: [
      'sui-try-open-vault',
      collateralId,
      debouncedTryOpenVaultCollateral,
      debouncedTryOpenVaultBitUsd
    ],
    queryFn: () =>
      tryOpenVault(
        collateralId as Address,
        Number(debouncedTryOpenVaultCollateral),
        Number(debouncedTryOpenVaultBitUsd)
      ),
    enabled: Boolean(
      contractAddresses?.bitSmileyPackageId &&
        account?.address &&
        suiClient &&
        collateralId
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

  const {
    refetchBalance: refetchWbtcBalance,
    isFetching: isFetchingWbtcBalance
  } = useSuiTokenBalance(`0x${collateral?.collateral?.tokenAddress}` as Address)
  const {
    refetchBalance: refetchBitUsdBalance,
    isFetching: isFetchingBitUsdBalance
  } = useSuiTokenBalance(
    `${contractAddresses?.bitUSDPackageId}::bitusd::BITUSD`
  )

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
