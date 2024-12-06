import { bcs } from '@mysten/sui/bcs'
import { Transaction } from '@mysten/sui/transactions'
import { useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getSuiChainConfig } from '@/utils/chain'
import { formatNumberAsCompact } from '@/utils/number'
import { parseFromMist } from '@/utils/sui'

import { useContractAddresses } from './useContractAddresses'
import { useSuiCollaterals } from './useSuiCollaterals'
import { useSuiExecute } from './useSuiExecute'
import { useSuiTokenPrice } from './useSuiTokenPrice'

export const useSuiTVL = () => {
  const { chain, address } = useWallet()
  const { suiContractAddresses } = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )

  const { collaterals } = useSuiCollaterals()

  const { getTokenPrice } = useSuiTokenPrice()

  const { fetchTransactionResult } = useSuiExecute()

  const PackageIds = useMemo(() => suiContractAddresses, [suiContractAddresses])

  const getTotalBusd = async () => {
    if (!PackageIds) return undefined

    const tx = new Transaction()
    tx.moveCall({
      target: `${PackageIds.bitSmileyPackageId}::bitsmiley::balance_of_bitusd`,
      arguments: [tx.object(PackageIds.bitSmileyObjectId)]
    })

    const bytes = await fetchTransactionResult(tx)
    if (!bytes || bytes.length === 0) return '0'
    return bcs.U64.parse(new Uint8Array(bytes))
  }

  const { data: bitusd, isLoading: isLoadingBitUSD } = useQuery({
    queryKey: [
      'total_busd',
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId
    ],
    queryFn: () => getTotalBusd(),
    enabled: !!(
      address &&
      suiContractAddresses?.bitSmileyPackageId &&
      suiContractAddresses?.bitSmileyObjectId
    )
  })

  const getCollateralBalance = async (tokenAddress: string = '') => {
    if (!PackageIds || !tokenAddress) return undefined

    const tx = new Transaction()
    tx.moveCall({
      target: `${PackageIds.bitSmileyPackageId}::bitsmiley::total_collateral`,
      arguments: [tx.object(PackageIds.bitSmileyObjectId)],
      typeArguments: [tokenAddress]
    })

    const bytes = await fetchTransactionResult(tx)

    if (!bytes || bytes.length === 0) return '0'
    return bcs.U64.parse(new Uint8Array(bytes))
  }

  const { data: collateralsTVL, isLoading: isLoadingWBTC } = useQuery({
    queryKey: [
      'sui',
      'tvl',
      PackageIds?.bitSmileyPackageId,
      PackageIds?.bitSmileyObjectId
    ],
    queryFn: async () => {
      const pricesAsMist = await Promise.allSettled(
        collaterals.map((c) => getTokenPrice(c.collateralId))
      )

      const balancesAsMist = await Promise.allSettled(
        collaterals.map((c) => getCollateralBalance(c.collateral?.tokenAddress))
      )

      const decimals = collaterals.map((c) => c.collateral?.decimals)
      const prices = pricesAsMist.map((p) => {
        if (p.status === 'fulfilled') return parseFromMist(p.value || 0)
        return '0'
      })

      const balances = balancesAsMist.map((b, idx) => {
        if (b.status === 'fulfilled')
          return parseFromMist(b.value || 0, decimals[`${idx}`] ?? 0)
        return '0'
      })

      const result = prices.map(
        (p, idx) => Number(p) * Number(balances[`${idx}`])
      )
      console.log('🚀 ~ queryFn: ~ result:', result)

      return result.reduce((a, b) => a + b, 0)
    },
    enabled: !!(
      address &&
      collaterals.length &&
      PackageIds?.bitSmileyPackageId &&
      PackageIds?.bitSmileyObjectId
    )
  })

  const suiTVL = useMemo(() => {
    if (!collateralsTVL || !bitusd) return 0
    return Number(collateralsTVL) + Number(parseFromMist(bitusd))
  }, [collateralsTVL, bitusd])

  const isFetching = isLoadingBitUSD || isLoadingWBTC

  const suiFormattedTVL = useMemo(
    () => (isFetching ? '--' : formatNumberAsCompact(suiTVL)),
    [isFetching, suiTVL]
  )

  return { isFetching, suiTVL, suiFormattedTVL }
}
