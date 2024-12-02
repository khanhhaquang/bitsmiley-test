import { bcs } from '@mysten/sui/bcs'
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import { parseEther } from 'viem'

import {
  BcsCollateral,
  ICollateralFromSuiChain,
  ISuiCollateral
} from '@/types/sui'
import { byteArrayToString } from '@/utils/number'
import { parseFromMist } from '@/utils/sui'

import { useProjectInfo } from './useProjectInfo'
import { useUserInfo } from './useUserInfo'

export type Collateral = {
  name: string
  collateralId: string
  tokenType: string
  debtTokenType: string

  maxDebt: number
  vaultMinDebt: number
  vaultMaxDebt: number

  safeFactor: bigint
  maxLTV: bigint

  liquidationFeeRate: bigint
  stabilityFeeRate: bigint
}

export type Deployment = {
  network: string
  settings: {
    totalDebtCeiling: number
    liquidationBeneficiary: string
    feeBeneficiary: string
  }
  collaterals: Collateral[]
}

export const useSuiCollaterals = (collateralId?: string) => {
  const { address: userAddress, suiChainIdAsNumber } = useUserInfo()

  const { suiChains } = useProjectInfo()

  const suiClient = useSuiClient() as SuiClient

  const PackageIds = useMemo(
    () => suiChains?.find((c) => c.chainId === suiChainIdAsNumber)?.contract,
    [suiChainIdAsNumber, suiChains]
  )

  const fetchTransactionResult = async (tx: Transaction) => {
    const res = await suiClient.devInspectTransactionBlock({
      sender: userAddress,
      transactionBlock: tx
    })

    if (res.error) {
      throw new Error(res.error)
    }
    return res.results![0].returnValues![0][0]
  }

  const getVaultAddressByOwner = async () => {
    if (!PackageIds) return null
    try {
      const tx = new Transaction()
      tx.moveCall({
        target: `${PackageIds.bitSmileyPackageId}::bitsmiley::get_vault`,
        arguments: [
          tx.object(PackageIds.bitSmileyObjectId),
          tx.pure.address(userAddress)
        ]
      })

      const txResult = await fetchTransactionResult(tx)
      console.log('🚀 ~ getVaultAddressByOwner ~ txResult:', txResult)

      return bcs.option(bcs.Address).parse(new Uint8Array(txResult))
    } catch (error) {
      console.log('🚀 ~ getVaultAddressByOwner ~ error:', error)
      return null
    }
  }

  const getStabilityFee = useCallback(
    (stabilityFeeRate?: bigint) => {
      if (!suiChainIdAsNumber) return 0
      const blockTime = suiChains?.find((w) => w.chainId === suiChainIdAsNumber)
        ?.blockTime

      if (!stabilityFeeRate || !blockTime) return 0

      const blocks = (365 * 24 * 3600) / blockTime
      return (
        Number(BigInt(blocks) * stabilityFeeRate * BigInt('1000000')) /
        Number(parseEther('1'))
      )
    },
    [suiChains, suiChainIdAsNumber]
  )

  const query = {
    // placeholderData: keepPreviousData,
    select: (res?: ICollateralFromSuiChain): ISuiCollateral | undefined => {
      console.log('🚀 ~ useSuiCollaterals ~ res:', res)
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
          liquidationFeeRate: parseFromMist(c.liquidationFeeRate).toString(),
          stabilityFee: getStabilityFee(BigInt(c.stabilityFeeRate)),
          collateral: {
            tokenAddress: c.collateral.token,
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
              : parseFromMist(c.collateral.total_locked).toString(),
            vaultMaxDebt: !c.collateral.vault_max_debt
              ? ''
              : parseFromMist(c.collateral.vault_max_debt).toString(),
            vaultMinDebt: !c.collateral.vault_min_debt
              ? ''
              : parseFromMist(c.collateral.vault_min_debt).toString()
          },

          // opened vault
          healthFactor: c.healthFactor
            ? (Number(c.healthFactor) / 10).toString()
            : '0',
          availableToMint: parseFromMist(
            c.availableToMint || BigInt(0)
          ).toString(),
          availableToWithdraw: parseFromMist(
            c.availableToWithdraw || BigInt(0)
          ).toString(),
          debt: parseFromMist(c.debt || BigInt(0)).toString(),
          fee: parseFromMist(c.fee || BigInt(0)).toString(),
          liquidationPrice: parseFromMist(
            c.liquidationPrice || BigInt(0)
          ).toString(),
          lockedCollateral: parseFromMist(
            c.lockedCollateral || BigInt(0)
          ).toString(),
          mintedBitUSD: parseFromMist(c.mintedBitUSD || BigInt(0)).toString()
        }))
      }
    }
  }

  const { data, isLoading, isError, isSuccess, isFetching, refetch } = useQuery(
    {
      ...query,
      retry: 5,
      retryDelay: 10000,
      queryKey: ['collaterals', userAddress, suiChainIdAsNumber],
      queryFn:
        !PackageIds || !userAddress
          ? undefined
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

              if (listCollateralsTxResult) {
                const collaterals = bcs
                  .vector(BcsCollateral)
                  .parse(Uint8Array.from(listCollateralsTxResult))

                //TODO: get vault address by owner
                const openedVaultAddress = await getVaultAddressByOwner()
                console.log('🚀 ~ : ~ openedVaultAddress:', openedVaultAddress)

                if (!getVaultAddressByOwner) {
                  return {
                    vaultAddress: undefined,
                    collaterals: collaterals.map((c) => ({
                      ...c,
                      isOpenVault: false
                    }))
                  }
                }

                // get vault liquidated info
                // const liquidatedRes = await UserService.getLiquidated.call({
                //   vault: [
                //     {
                //       network: 'Sui',
                //       vaultAddress: openedVaultAddress
                //     }
                //   ]
                // })
              }

              return undefined
            }
    }
  )

  const collaterals = useMemo(
    () => data?.collaterals || [],
    [data?.collaterals]
  )
  // console.log('🚀 ~ useSuiCollaterals ~ collaterals:', collaterals)

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
    () => collaterals?.find((p) => p.collateralId === collateralId),
    [collateralId, collaterals]
  )

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
