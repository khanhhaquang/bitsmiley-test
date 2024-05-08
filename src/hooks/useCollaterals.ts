import { useQueries, } from '@tanstack/react-query'
import { useMemo, useCallback } from 'react'
import {
  decodeFunctionResult,
  encodeFunctionData,
  formatEther,
  isAddressEqual,
  parseEther
} from 'viem'

import {
  bitLayerMainnet,
  bitLayerTestnet,
  bobTestnet,
  bSquaredTestnet,
  merlinMainnet,
  merlinTestnet
} from '@/config/wagmi'
import { bitSmileyAbi } from '@/contracts/BitSmiley'
import { bitSmileyQueryAbi } from '@/contracts/BitSmileyQuery'
import { UserService } from '@/services/user'
import {
  ICollateral,
  ICollateralFromChain,
  IDetailedCollateral
} from '@/types/vault'

import { useProjectInfo } from './useProjectInfo'
import { useSupportedChains } from './useSupportedChains'
import { useUserInfo } from './useUserInfo'


//TODO: change the way we'r fetching
export const useCollaterals = (chainId?: number, collateralId?: string) => {
  const { address } = useUserInfo()
  const { projectInfo } = useProjectInfo()
  const { clients } = useSupportedChains()

  const filterClients = useMemo(
    () =>
      clients.filter(
        (s) =>
          !!projectInfo?.web3Info.find((w) => w.chainId === s.chain.id)?.contract
            ?.BitSmiley &&
          !!projectInfo?.web3Info.find((w) => w.chainId === s.chain.id)?.contract
            ?.bitSmileyQuery
      ),
    [projectInfo?.web3Info, clients]
  )

  const getStabilityFee = useCallback(
    (chainId: number, stabilityFeeRate?: bigint) => {
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
    [chainId, projectInfo?.web3Info]
  )

  const chainIdToNetwork: { [key: number]: string } = {
    [merlinMainnet.id]: 'Merlin',
    [merlinTestnet.id]: 'Merlin',
    [bobTestnet.id]: 'Bob',
    [bSquaredTestnet.id]: 'B2',
    [bitLayerTestnet.id]: 'BitLayer',
    [bitLayerMainnet.id]: 'BitLayer'
  }

  const queryRes = useQueries({
    queries: filterClients.map((client) => ({
      retry: 5,
      retryDelay: 10000,
      queryKey: [client.chain.id, 'collaterals', address],
      queryFn: !client || !address
        ? undefined
        : async () => {
          const contractAddresses = projectInfo?.web3Info.find(
            (w) => w.chainId === client.chain.id
          )?.contract
          const bitSmileyAddress = contractAddresses?.BitSmiley
          const bitSmileyQueryAddress = contractAddresses?.bitSmileyQuery

          // if (
          //   !bitSmileyQueryAddress ||
          //   !bitSmileyAddress
          //   ){
          //   return {
          //     chainId,
          //     vaultAddress: undefined,
          //     // collaterals: collaterals.map((c) => ({
          //     //   ...c,
          //     //   isOpenVault: false
          //     // }))
          //   }
          // }

          // collaterals information
          const collateralsRes = await client.request({
            method: 'eth_call',
            params: [
              {
                data: encodeFunctionData({
                  abi: bitSmileyQueryAbi,
                  functionName: 'listCollaterals'
                }),
                to: bitSmileyQueryAddress
              },
              'latest'
            ]
          })

          const collaterals = decodeFunctionResult({
            abi: bitSmileyQueryAbi,
            functionName: 'listCollaterals',
            data: collateralsRes
          })

          // vaultAddress
          const vaultAddressRes = await client.request({
            method: 'eth_call',
            params: [
              {
                data: encodeFunctionData({
                  abi: bitSmileyAbi,
                  functionName: 'owners',
                  args: [address]
                }),
                to: bitSmileyAddress
              },
              'latest'
            ]
          })

          const vaultAddress = decodeFunctionResult({
            abi: bitSmileyAbi,
            functionName: 'owners',
            data: vaultAddressRes
          })

          if (
            isAddressEqual(
              vaultAddress,
              '0x0000000000000000000000000000000000000000'
            )
          ) {
            return {
              chainId: client.chain.id,
              chain: client.chain,
              vaultAddress: undefined,
              collaterals: collaterals.map((c) => ({
                ...c,
                isOpenVault: false
              }))
            }
          }

          // get vault liquidated info
          const liquidatedRes = await UserService.getLiquidated.call({
            vault: [
              {
                network: chainIdToNetwork[client.chain.id],
                vaultAddress
              }
            ]
          })

          // getVault collateralId
          const bitSmileyVaultRes = await client.request({
            method: 'eth_call',
            params: [
              {
                data: encodeFunctionData({
                  abi: bitSmileyAbi,
                  functionName: 'vaults',
                  args: [vaultAddress]
                }),
                to: bitSmileyAddress
              },
              'latest'
            ]
          })

          const bitSmileyVault = decodeFunctionResult({
            abi: bitSmileyAbi,
            functionName: 'vaults',
            data: bitSmileyVaultRes
          })
          const collateralId = bitSmileyVault?.[1]

          // vault details
          const vaultDetailRes = await client.request({
            method: 'eth_call',
            params: [
              {
                data: encodeFunctionData({
                  abi: bitSmileyQueryAbi,
                  functionName: 'getVaultDetail',
                  args: [vaultAddress, BigInt(0), BigInt(0)]
                }),
                to: bitSmileyQueryAddress
              },
              'latest'
            ]
          })

          const vaultDetail = decodeFunctionResult({
            abi: bitSmileyQueryAbi,
            functionName: 'getVaultDetail',
            data: vaultDetailRes
          })

          const filteredCollaterals = (
            collateralId
              ? collaterals.filter((c) => c.collateralId === collateralId)
              : collaterals
          ).map((c) => ({
            ...c,
            isOpenVault: !!collateralId && c.collateralId === collateralId,
            ...(c.collateralId === collateralId ? vaultDetail : {}),
            liquidated: liquidatedRes?.data?.liquidated
          }))

          return {
            chainId: client.chain.id,
            chain: client.chain,
            vaultAddress,
            collaterals: filteredCollaterals
          }
        }
    }))
  })

  const parseQuery = (res?: ICollateralFromChain): ICollateral | undefined => ({
    chainId: res?.chainId!,
    chain: res?.chain,
    vaultAddress: res?.vaultAddress,
    collaterals: res?.collaterals?.map((c) => ({
      name: c.name,
      chainId: res?.chainId!,
      isOpenVault: c.isOpenVault,
      collateralId: c.collateralId,
      maxLTV: (Number(formatEther(c.maxLTV)) * 10 ** 9).toString(),
      liquidationFeeRate: (
        Number(formatEther(c.liquidationFeeRate)) *
        10 ** 6
      ).toString(),
      stabilityFee: getStabilityFee(res?.chainId!, c.stabilityFeeRate),
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
  })

  const chainWithCollaterals = useMemo(() => {
    return queryRes.map((res) => {
      const { data: query, ...rest } = res
      return { ...parseQuery(query), ...rest }
    })
  }, [queryRes])

  const collaterals: IDetailedCollateral[] = useMemo(() =>
    chainWithCollaterals.reduce<IDetailedCollateral[]>((acc, cur) =>
      cur.collaterals != undefined ? acc.concat(cur.collaterals) : acc, []
    ), [chainWithCollaterals])

  const availableCollaterals = useMemo(() =>
    chainWithCollaterals?.map((item) => ({
      ...item,
      collaterals: item?.collaterals?.filter((c) => !c.isOpenVault) || []
    })).filter((item) => item.collaterals.length > 0)
    , [chainWithCollaterals]
  )

  const openedCollaterals = useMemo(() =>
    chainWithCollaterals?.map((item) => ({
      ...item,
      collaterals: item?.collaterals?.filter((c) => c.isOpenVault) || []
    })).filter((item) => item.collaterals.length > 0)
    , [chainWithCollaterals]
  )

  // const hasOpenedCollaterals = useMemo(
  //   () => openedCollaterals.length > 0,
  //   [openedCollaterals.length]
  // )

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
    if (!chainId) return;
    queryRes.find((item) => item.data?.chainId === chainId)?.refetch()
  }, [chainId])

  const isFetching = useMemo(
    () => {
      if (!chainId) return false;
      return queryRes.find((item) => item.data?.chainId === chainId)?.isFetching
    }, [queryRes]
  )

  const isLoading = useMemo(
    () => {
      if (!chainId) return false;
      return queryRes.find((item) => item.data?.chainId === chainId)?.isLoading
    }, [queryRes]
  )

  return {
    collaterals,
    availableCollaterals,
    openedCollaterals,
    collateral,
    isMyVault,
    refetch,
    isFetching,
    isLoading
  }
}
