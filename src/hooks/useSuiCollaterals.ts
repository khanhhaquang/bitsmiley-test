import { bcs } from '@mysten/sui/bcs'
import { Transaction } from '@mysten/sui/transactions'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'

import { UserService } from '@/services/user'
import {
  BcsCollateral,
  BcsVaultDetail,
  BcsVaultInfo,
  ICollateralFromSuiChain,
  IDetailedCollateralFromSuiChain,
  ISuiCollateral
} from '@/types/sui'
import { byteArrayToString } from '@/utils/number'
import { fromMistToSignValue, parseFromMist, toI64 } from '@/utils/sui'

import { useProjectInfo } from './useProjectInfo'
import { useSuiExecute } from './useSuiExecute'
import { useSuiVaultAddress } from './useSuiVaultAddress'
import { useUserInfo } from './useUserInfo'

export const useSuiCollaterals = (collateralId?: string) => {
  const { address: userAddress, suiChainIdAsNumber } = useUserInfo()
  const {
    vaultAddress: openedVaultAddress,
    isFetched: isFetchedOpenedVaultAddress
  } = useSuiVaultAddress()

  const { suiChains } = useProjectInfo()

  const { fetchTransactionResult } = useSuiExecute()

  const PackageIds = useMemo(
    () => suiChains?.find((c) => c.chainId === suiChainIdAsNumber)?.contract,
    [suiChainIdAsNumber, suiChains]
  )
  const getVaultCollateralId = async () => {
    try {
      if (!PackageIds || !openedVaultAddress) return undefined
      const tx = new Transaction()
      tx.moveCall({
        target: `${PackageIds.bitSmileyPackageId}::bitsmiley::get_vault_info`,
        arguments: [
          tx.object(PackageIds.bitSmileyObjectId),
          tx.pure.address(openedVaultAddress)
        ]
      })
      const result = await fetchTransactionResult(tx)

      if (result && result.length > 0) {
        const { collateral_id } = BcsVaultInfo.parse(new Uint8Array(result))
        if (collateral_id) {
          return byteArrayToString(collateral_id.bytes)
        } else {
          return undefined
        }
      }

      return undefined
    } catch (error) {
      console.log('🚀 ~ getVaultCollateralId ~ error:', error)
    }
  }

  const getVaultDetail = async () => {
    try {
      if (!PackageIds) return null
      const tx = new Transaction()
      tx.moveCall({
        target: `${PackageIds.bitSmileyPackageId}::query::get_vault_detail`,
        arguments: [
          tx.object(PackageIds?.bitSmileyQueryObjectId),
          tx.object(PackageIds?.bitSmileyObjectId),
          tx.object(PackageIds?.vaultManagerObjectId),
          tx.object(PackageIds?.stabilityFeeObjectId),
          tx.object(PackageIds?.oracleObjectId),
          tx.pure.address(openedVaultAddress),
          tx.pure(toI64(BigInt(0))),
          tx.pure(toI64(BigInt(0))),
          tx.object.clock()
        ]
      })
      const result = await fetchTransactionResult(tx)
      if (result && result?.length > 0)
        return BcsVaultDetail.parse(new Uint8Array(result))

      return undefined
    } catch (error) {
      console.log('🚀 ~ getVaultDetail ~ error:', error)
    }
  }

  const getStabilityFee = useCallback(
    (stabilityFeeRate?: bigint) => {
      if (!suiChainIdAsNumber) return 0
      const blockTime = suiChains?.find((w) => w.chainId === suiChainIdAsNumber)
        ?.blockTime

      if (!stabilityFeeRate || !blockTime) return 0

      const blocks = (365 * 24 * 3600) / blockTime
      return Number(BigInt(blocks) * stabilityFeeRate) / 10 ** 12 / 100
    },
    [suiChains, suiChainIdAsNumber]
  )

  const query = {
    // placeholderData: keepPreviousData,
    select: (res?: ICollateralFromSuiChain): ISuiCollateral | undefined => {
      if (!res || !suiChainIdAsNumber) return undefined
      return {
        chainId: suiChainIdAsNumber,
        vaultAddress: res?.vaultAddress,
        collaterals: res?.collaterals?.map((c) => ({
          name: c.name,
          chainId: suiChainIdAsNumber,
          isOpenVault: c.isOpenVault, // TO DO: Not return true when have vault
          collateralId: byteArrayToString(c.collateralId.bytes),
          maxLTV: parseFromMist(c.maxLtv).toString(),
          liquidationFeeRate: parseFromMist(
            c.liquidationFeeRate,
            14 // 12 decimals + 2 of percentage
          ).toString(),
          stabilityFee: getStabilityFee(BigInt(c.stabilityFeeRate)),
          collateral: {
            decimals: c.collateral.decimals,
            tokenAddress: `0x${c.collateral.token}`,
            maxDebt: !c.collateral.max_debt
              ? ''
              : parseFromMist(c.collateral.max_debt).toString(),
            safetyFactor: !c.collateral.safety_factor
              ? ''
              : parseFromMist(c.collateral.safety_factor).toString(),
            totalDebt: !c.collateral.total_debt
              ? ''
              : parseFromMist(c.collateral.total_debt).toString(),
            totalLocked: !c.collateral.total_locked
              ? ''
              : parseFromMist(
                  c.collateral.total_locked,
                  c.collateral.decimals
                ).toString(),
            vaultMaxDebt: !c.collateral.vault_max_debt
              ? ''
              : parseFromMist(c.collateral.vault_max_debt).toString(),
            vaultMinDebt: !c.collateral.vault_min_debt
              ? ''
              : parseFromMist(c.collateral.vault_min_debt).toString()
          },

          // opened vault
          healthFactor: c.health_factor
            ? (Number(c.health_factor) / 10).toString()
            : '',
          availableToMint: fromMistToSignValue(
            BigInt(c.available_to_mint?.value || 0),
            c.available_to_mint?.is_negative
          ).toString(),
          availableToWithdraw: fromMistToSignValue(
            BigInt(c.available_to_withdraw?.value || 0),
            c.available_to_withdraw?.is_negative,
            c.collateral.decimals
          ).toString(),
          lockedCollateral: fromMistToSignValue(
            BigInt(c.locked_collateral?.value || 0),
            c.locked_collateral?.is_negative,
            c.collateral.decimals
          ).toString(),
          debt: fromMistToSignValue(
            BigInt(c.debt?.value || 0),
            c.debt?.is_negative
          ).toString(),
          fee: parseFromMist(c.fee || BigInt(0)).toString(),
          liquidationPrice: parseFromMist(
            c.liquidation_price || BigInt(0)
          ).toString(),
          mintedBitUSD: parseFromMist(c.minted_bitusd || BigInt(0)).toString(),
          liquidated: c.liquidated
        }))
      }
    }
  }

  const { data, isLoading, isError, isSuccess, isFetching, refetch } = useQuery(
    {
      ...query,
      retry: 5,
      retryDelay: 10000,
      enabled: isFetchedOpenedVaultAddress && !!PackageIds && !!userAddress,
      queryKey: ['collaterals', userAddress, suiChainIdAsNumber],
      queryFn:
        !PackageIds || !userAddress
          ? () => undefined
          : async () => {
              const listCollateralsTx = new Transaction()
              listCollateralsTx.moveCall({
                target: `${PackageIds.bitSmileyPackageId}::query::list_collaterals`,
                arguments: [
                  listCollateralsTx.object(PackageIds.bitSmileyQueryObjectId),
                  listCollateralsTx.object(PackageIds.bitSmileyObjectId),
                  listCollateralsTx.object(PackageIds.vaultManagerObjectId),
                  listCollateralsTx.object(PackageIds.stabilityFeeObjectId)
                ]
              })

              const listCollateralsTxResult =
                await fetchTransactionResult(listCollateralsTx)

              if (
                !listCollateralsTxResult ||
                listCollateralsTxResult.length === 0
              )
                return undefined

              const collaterals = bcs
                .vector(BcsCollateral)
                .parse(Uint8Array.from(listCollateralsTxResult))

              console.log('🚀 ~ : ~ collaterals:', collaterals)

              if (!openedVaultAddress) {
                return {
                  collaterals
                }
              }

              // get vault liquidated info
              const liquidatedRes = await UserService.getLiquidated.call({
                vault: [
                  {
                    network: 'Sui',
                    vaultAddress: openedVaultAddress
                  }
                ]
              })

              // get collateral id by vault address
              const collateralId = await getVaultCollateralId()
              const vaultDetail = await getVaultDetail()
              console.log(
                '🚀 ~ : ~ opened collateralId:',
                collateralId,
                vaultDetail
              )

              return {
                vaultAddress: openedVaultAddress,
                collaterals: collaterals.map(
                  (c): IDetailedCollateralFromSuiChain => {
                    if (
                      byteArrayToString(c.collateralId.bytes) === collateralId
                    ) {
                      return {
                        ...c,
                        ...(vaultDetail || {}),
                        isOpenVault: true,
                        liquidated: liquidatedRes.data.liquidated
                      }
                    }

                    return c
                  }
                )
              }
            }
    }
  )

  const collaterals = useMemo(
    () => data?.collaterals || [],
    [data?.collaterals]
  )

  const availableCollaterals = useMemo(() => {
    return collaterals?.filter((item) => !item.isOpenVault) || []
  }, [collaterals])

  const openedCollaterals = useMemo(() => {
    return collaterals?.filter((item) => item.isOpenVault) || []
  }, [collaterals])

  const hasOpenedCollaterals = useMemo(
    () => collaterals.some((item) => item.isOpenVault),
    [collaterals]
  )

  const isMyVault = useMemo(() => {
    if (!collateralId) return false
    return !!collaterals
      ?.filter((item) => item.isOpenVault)
      ?.find((p) => p.collateralId === collateralId)
  }, [collateralId, collaterals])

  const collateral = useMemo(
    () =>
      collaterals?.find((p) => collateralId && p.collateralId === collateralId),
    [collateralId, collaterals]
  )
  console.log('🚀 ~ useSuiCollaterals ~ collateral:', collateral)

  return {
    collaterals,
    hasOpenedCollaterals,
    availableCollaterals,
    openedCollaterals,
    collateral,
    isMyVault,
    refetch,
    isFetching,
    isLoading,
    isError,
    isSuccess
  }
}
