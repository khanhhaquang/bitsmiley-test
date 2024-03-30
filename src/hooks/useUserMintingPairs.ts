import { useQuery } from '@tanstack/react-query'
import groupBy from 'lodash/groupBy'
import { useMemo } from 'react'
import { decodeFunctionResult, formatEther, parseEther } from 'viem'

import bitSmileyQuery from '@/abi/BitSmileyQuery.json'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IMintingPair, UserService } from '@/services/user'
import { ICollateralFromChain } from '@/types/vault'

import { useProjectInfo } from './useProjectInfo'

export const useUserMintingPairs = (
  chainId?: number,
  collateralId?: string
) => {
  const { address } = useUserInfo()
  const { projectInfo } = useProjectInfo()

  const { data: allCollaterals, isLoading: isLoadingAllCollaterals } = useQuery(
    {
      queryKey: [UserService.getAllVaultInfo.key],
      queryFn: () => UserService.getAllVaultInfo.call(),
      select: (res) => {
        const vaults = res.data.map((v) => {
          const network = Object.keys(v)?.[0]
          const data = Object.values(v)?.[0]

          const collaterals = decodeFunctionResult({
            abi: bitSmileyQuery,
            functionName: 'listCollaterals',
            data
          }) as ICollateralFromChain[]

          return { network, collaterals }
        })

        return vaults
      }
    }
  )

  const mintingParisParams = allCollaterals?.map((v) => ({
    network: v.network,
    name: v.collaterals.map((i) => i.name).filter((v) => !!v)
  }))

  const {
    data: mintingPairs,
    isLoading: isLoadingMintingPairs,
    ...rest
  } = useQuery({
    queryKey: [UserService.getMintingPairs.key, address, mintingParisParams],
    queryFn: () =>
      !address || !mintingParisParams?.length
        ? null
        : UserService.getMintingPairs.call(address, mintingParisParams),
    select: (res) => {
      const flatCollaterals = allCollaterals?.reduce<
        (ICollateralFromChain & { network: string })[]
      >(
        (pre, cur) => [
          ...pre,
          ...cur.collaterals.map((i) => ({ ...i, network: cur.network }))
        ],
        []
      )

      const formattedCollaterals = flatCollaterals?.map((c) => ({
        name: c.name,
        network: c.network,
        collateralId: c.collateralId,
        liquidationFeeRate: !c.liquidationFeeRate
          ? ''
          : (Number(formatEther(c.liquidationFeeRate)) * 10 ** 6).toString(),
        maxLTV: !c.maxLTV
          ? ''
          : (Number(formatEther(c.maxLTV)) * 10 ** 9).toString(),
        stabilityFeeRate: c.stabilityFeeRate,
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
        }
      }))

      const formattedMintingPairs = res?.data?.map((i) => ({
        ...i,
        fee: !i.fee ? '' : formatEther(BigInt(i.fee)),
        availableToMint: !i.availableToMint
          ? ''
          : formatEther(BigInt(i.availableToMint)),
        liquidationPrice: !i.liquidationPrice
          ? ''
          : formatEther(BigInt(i.liquidationPrice)),
        healthFactor: (Number(i.healthFactor) / 100).toString(),
        availableToWithdraw: !i.availableToWithdraw
          ? ''
          : formatEther(BigInt(i.availableToWithdraw)),
        debt: !i.debt ? '' : formatEther(BigInt(i.debt)),
        mintedBitUSD: !i.mintedBitUSD
          ? ''
          : formatEther(BigInt(i.mintedBitUSD)),
        lockedCollateral: !i.lockedCollateral
          ? ''
          : formatEther(BigInt(i.lockedCollateral))
      }))

      const allMintingPairs = formattedMintingPairs?.map((c) => ({
        ...c,
        ...formattedCollaterals?.find(
          (i) =>
            i.collateralId.toLowerCase() ===
              `0x${c.collateralId}`.toLowerCase() && i.network === c.network
        )
      }))

      const mintingPairsWithStabilityFee = allMintingPairs?.map((m) => ({
        ...m,
        stabilityFee: getStabilityFee(
          m.stabilityFeeRate,
          projectInfo?.web3Info.find((i) => i.chainId === m.chainId)?.blockTime
        )
      })) as IMintingPair[] | undefined

      return mintingPairsWithStabilityFee
    }
  })

  const availableMintingPairs = useMemo(
    () => groupBy(mintingPairs?.filter((item) => !item.isOpenVault), 'chainId'),
    [mintingPairs]
  )

  const openedMintingPairs = useMemo(
    () => groupBy(mintingPairs?.filter((item) => item.isOpenVault), 'chainId'),
    [mintingPairs]
  )

  const hasOpenedMintingPairs = useMemo(
    () => !!mintingPairs?.filter((item) => item.isOpenVault).length,
    [mintingPairs]
  )

  const isMyVault = useMemo(() => {
    if (!chainId || !collateralId) return false
    return !!mintingPairs
      ?.filter((item) => item.isOpenVault)
      ?.find((p) => p.chainId === chainId && p.collateralId === collateralId)
  }, [chainId, collateralId, mintingPairs])

  const mintingPair = useMemo(
    () =>
      mintingPairs?.find(
        (p) => p.chainId === chainId && p.collateralId === collateralId
      ),
    [chainId, collateralId, mintingPairs]
  )

  const isLoading = useMemo(
    () => isLoadingAllCollaterals || isLoadingMintingPairs,
    [isLoadingAllCollaterals, isLoadingMintingPairs]
  )

  return {
    availableMintingPairs,
    openedMintingPairs,
    hasOpenedMintingPairs,
    mintingPair,
    isLoading,
    isMyVault,
    ...rest
  }
}

function getStabilityFee(
  stabilityFeeRate?: bigint,
  blockTime?: number
): number {
  if (!stabilityFeeRate || !blockTime) return 0

  const blocks = (365 * 24 * 3600) / blockTime
  return (
    Number(BigInt(blocks) * stabilityFeeRate * BigInt('1000000')) /
    Number(parseEther('1'))
  )
}
