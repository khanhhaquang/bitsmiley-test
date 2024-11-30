import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import { Address, formatEther, parseEther } from 'viem'

import {
  ICollateral,
  ICollateralFromChain,
  IDetailedCollateral,
  IDetailedCollateralFromChain
} from '@/types/vault'
import { collateralHash } from '@/utils/sui'

import { useProjectInfo } from './useProjectInfo'
import { useSuiVault } from './useSuiVault'
import { useSupportedChains } from './useSupportedChains'
import { useUserInfo } from './useUserInfo'

export const queryKeys = {
  collaterals: (chainId?: number, userAddress?: Address) => [
    'collaterals',
    chainId,
    userAddress
  ]
}

//TODO: change the way we'r fetching
export const useSuiCollaterals = (chainId?: number, collateralId?: string) => {
  const { address } = useUserInfo()
  const { projectInfo } = useProjectInfo()
  const { clients } = useSupportedChains()
  const queryClient = useQueryClient()

  const { vaultAddress: suiVaultAddress } = useSuiVault()

  const suiClient = useMemo(
    () =>
      clients.find((s) => {
        const chainInfo = projectInfo?.web3Info.find(
          (w) => w.chainId === s.chain.id
        )
        return !!chainInfo?.contract?.bitSmileyObjectId
      }),
    [projectInfo?.web3Info, clients]
  )

  const getStabilityFee = useCallback(
    (chainId?: number, stabilityFeeRate?: bigint) => {
      if (!chainId) return 0
      const blockTime = projectInfo?.web3Info?.find(
        (w) => w.chainId === chainId
      )?.blockTime

      if (!stabilityFeeRate || !blockTime) return 0

      const blocks = (365 * 24 * 3600) / blockTime
      return (
        Number(BigInt(blocks) * stabilityFeeRate * BigInt('1000000')) /
        Number(parseEther('1'))
      )
    },
    [projectInfo?.web3Info]
  )

  const query = {
    // placeholderData: keepPreviousData,
    select: (res?: ICollateralFromChain): ICollateral | undefined => {
      if (!res) return undefined
      return {
        chainId: res?.chainId,
        vaultAddress: res?.vaultAddress,
        collaterals: res?.collaterals?.map((c) => ({
          name: c.name,
          chainId: res?.chainId,
          isOpenVault: c.isOpenVault,
          collateralId: c.collateralId,
          maxLTV: (Number(formatEther(c.maxLTV)) * 10 ** 9).toString(),
          liquidationFeeRate: (
            Number(formatEther(c.liquidationFeeRate)) *
            10 ** 6
          ).toString(),
          stabilityFee: getStabilityFee(res?.chainId, c.stabilityFeeRate),
          collateral: {
            tokenAddress: c.collateral.tokenAddress,
            maxDebt: !c.collateral.maxDebt
              ? ''
              : formatEther(c.collateral.maxDebt),
            safetyFactor: !c.collateral.safetyFactor
              ? ''
              : formatEther(c.collateral.safetyFactor),
            totalDebt: !c.collateral.totalDebt
              ? ''
              : formatEther(c.collateral.totalDebt),
            totalLocked: !c.collateral.totalLocked
              ? ''
              : formatEther(c.collateral.totalLocked),
            vaultMaxDebt: !c.collateral.vaultMaxDebt
              ? ''
              : formatEther(c.collateral.vaultMaxDebt),
            vaultMinDebt: !c.collateral.vaultMinDebt
              ? ''
              : formatEther(c.collateral.vaultMinDebt)
          },

          // opened vault
          healthFactor: (Number(c.healthFactor) / 10).toString(),
          availableToMint: formatEther(c.availableToMint || BigInt(0)),
          availableToWithdraw: formatEther(c.availableToWithdraw || BigInt(0)),
          debt: formatEther(c.debt || BigInt(0)),
          fee: formatEther(c.fee || BigInt(0)),
          liquidationPrice: formatEther(c.liquidationPrice || BigInt(0)),
          lockedCollateral: formatEther(c.lockedCollateral || BigInt(0)),
          mintedBitUSD: formatEther(c.mintedBitUSD || BigInt(0))
        }))
      }
    }
  }

  const queryRes = useQueries({
    queries: [
      {
        ...query,
        retry: 5,
        retryDelay: 10000,
        queryKey: queryKeys.collaterals(suiClient?.chain?.id, address),
        queryFn:
          !suiClient || !address
            ? undefined
            : async () => {
                // const contractAddresses = projectInfo?.web3Info.find(
                //   (w) => w.chainId === suiClient.chain.id
                // )?.contract
                const collateralId = collateralHash('BTC')
                //           // const bitSmileyAddress = contractAddresses?.BitSmiley
                //           // const bitSmileyQueryAddress = contractAddresses?.bitSmileyQuery
                //           // if (
                //           //   !bitSmileyQueryAddress ||
                //           //   !bitSmileyAddress
                //           //   ){
                //           //   return {
                //           //     chainId,
                //           //     vaultAddress: undefined,
                //           //     // collaterals: collaterals.map((c) => ({
                //           //     //   ...c,
                //           //     //   isOpenVault: false
                //           //     // }))
                //           //   }
                //           // }
                //           // collaterals information
                //           // const collateralsRes = await client.request({
                //           //   method: 'eth_call',
                //           //   params: [
                //           //     {
                //           //       data: encodeFunctionData({
                //           //         abi: bitSmileyQueryAbi,
                //           //         functionName: 'listCollaterals'
                //           //       }),
                //           //       to: bitSmileyQueryAddress
                //           //     },
                //           //     'latest'
                //           //   ]
                //           // })
                //           // const collaterals = decodeFunctionResult({
                //           //   abi: bitSmileyQueryAbi,
                //           //   functionName: 'listCollaterals',
                //           //   data: collateralsRes
                //           // })
                //           // vaultAddress
                if (suiVaultAddress) {
                  return {
                    chainId: suiClient.chain.id,
                    vaultAddress: suiVaultAddress,
                    collateralId,
                    collaterals: [
                      {
                        collateralId,
                        isOpenVault: false,
                        maxLTV: 0,
                        liquidationFeeRate: 0,
                        collateral: {
                          maxDebt: BigInt(0),
                          safetyFactor: BigInt(0),
                          tokenAddress: '',
                          totalDebt: BigInt(0),
                          totalLocked: BigInt(0),
                          vaultMaxDebt: BigInt(0),
                          vaultMinDebt: BigInt(0)
                        }
                      } as unknown as IDetailedCollateralFromChain
                    ]
                    // collaterals: collaterals.map((c) => ({
                    //   ...c,
                    //   isOpenVault: false
                    // }))
                  } as ICollateralFromChain
                }
                //           // get vault liquidated info
                //           // const liquidatedRes = await UserService.getLiquidated.call({
                //           //   vault: [
                //           //     {
                //           //       network: chainIdToNetwork[client.chain.id],
                //           //       vaultAddress
                //           //     }
                //           //   ]
                //           // })
                //           // // getVault collateralId
                //           // const bitSmileyVaultRes = await client.request({
                //           //   method: 'eth_call',
                //           //   params: [
                //           //     {
                //           //       data: encodeFunctionData({
                //           //         abi: bitSmileyAbi,
                //           //         functionName: 'vaults',
                //           //         args: [vaultAddress]
                //           //       }),
                //           //       to: bitSmileyAddress
                //           //     },
                //           //     'latest'
                //           //   ]
                //           // })
                //           // const bitSmileyVault = decodeFunctionResult({
                //           //   abi: bitSmileyAbi,
                //           //   functionName: 'vaults',
                //           //   data: bitSmileyVaultRes
                //           // })
                //           // const collateralId = bitSmileyVault?.[1]
                //           // // vault details
                //           // const vaultDetailRes = await client.request({
                //           //   method: 'eth_call',
                //           //   params: [
                //           //     {
                //           //       data: encodeFunctionData({
                //           //         abi: bitSmileyQueryAbi,
                //           //         functionName: 'getVaultDetail',
                //           //         args: [vaultAddress, BigInt(0), BigInt(0)]
                //           //       }),
                //           //       to: bitSmileyQueryAddress
                //           //     },
                //           //     'latest'
                //           //   ]
                //           // })
                //           // const vaultDetail = decodeFunctionResult({
                //           //   abi: bitSmileyQueryAbi,
                //           //   functionName: 'getVaultDetail',
                //           //   data: vaultDetailRes
                //           // })
                //           // const filteredCollaterals = (
                //           //   collateralId
                //           //     ? collaterals.filter((c) => c.collateralId === collateralId)
                //           //     : collaterals
                //           // ).map((c) => ({
                //           //   ...c,
                //           //   isOpenVault:
                //           //     !!collateralId && c.collateralId === collateralId,
                //           //   ...(c.collateralId === collateralId ? vaultDetail : {}),
                //           //   liquidated: liquidatedRes?.data?.liquidated
                //           // }))
                return {
                  chainId: suiClient.chain.id,
                  collateralId,
                  collaterals: [
                    {
                      collateralId,
                      chainId: suiClient.chain.id.toString(),
                      maxLTV: 0,
                      liquidationFeeRate: 0,
                      isOpenVault: true,
                      collateral: {
                        maxDebt: BigInt(0),
                        safetyFactor: BigInt(0),
                        tokenAddress: '',
                        totalDebt: BigInt(0),
                        totalLocked: BigInt(0),
                        vaultMaxDebt: BigInt(0),
                        vaultMinDebt: BigInt(0)
                      }
                    } as unknown as IDetailedCollateralFromChain
                  ]
                } as ICollateralFromChain
              }
      }
    ]
  })

  const chainWithCollaterals = useMemo(() => {
    return queryRes.map((res) => {
      const { data: query, ...rest } = res
      return { ...query, ...rest }
    })
  }, [queryRes])

  const collaterals: IDetailedCollateral[] = useMemo(
    () =>
      chainWithCollaterals.reduce<IDetailedCollateral[]>(
        (acc, cur) =>
          cur.collaterals != undefined ? acc.concat(cur.collaterals) : acc,
        []
      ),
    [chainWithCollaterals]
  )

  const availableCollaterals = useMemo(() => {
    if (!chainId) return []
    return (
      chainWithCollaterals
        ?.find((c) => c.chainId === chainId)
        ?.collaterals?.filter((item) => !item.isOpenVault) || []
    )
  }, [chainWithCollaterals, chainId])

  const openedCollaterals = useMemo(() => {
    if (!chainId) return []
    return (
      chainWithCollaterals
        ?.find((c) => c.chainId === chainId)
        ?.collaterals?.filter((item) => item.isOpenVault) || []
    )
  }, [chainWithCollaterals, chainId])

  const hasOpenedCollaterals = useMemo(
    () => collaterals.some((item) => item.isOpenVault),
    [collaterals]
  )

  const isMyVault = useMemo(() => {
    if (!chainId || !collateralId) return false
    return !!collaterals
      ?.filter((item) => item.isOpenVault)
      ?.find((p) => p.chainId === chainId && p.collateralId === collateralId)
  }, [chainId, collateralId, collaterals])

  const collateral = useMemo(
    () =>
      collaterals?.find(
        (p) => p.chainId === chainId && p.collateralId === collateralId
      ),
    [chainId, collateralId, collaterals]
  )

  const refetch = useCallback(() => {
    if (!chainId) return
    queryClient.refetchQueries({
      queryKey: queryKeys.collaterals(chainId, address)
    })
  }, [chainId, queryClient, address])

  const queryState = queryClient.getQueryState(
    queryKeys.collaterals(chainId, address)
  )

  const isFetching = useMemo(() => {
    return (
      queryState?.fetchStatus === 'fetching' || queryState?.status === 'pending'
    )
  }, [queryState?.fetchStatus, queryState?.status])

  const isLoading = useMemo(() => {
    return queryState?.status === 'pending'
  }, [queryState?.status])

  const isError = useMemo(() => {
    return queryState?.status === 'error'
  }, [queryState?.status])

  const isSuccess = useMemo(() => {
    return queryState?.status === 'success'
  }, [queryState?.status])

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
