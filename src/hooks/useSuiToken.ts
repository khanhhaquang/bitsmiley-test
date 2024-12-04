import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { parseFromMist } from '@/utils/sui'

export const useSuiToken = (coinType: string) => {
  const suiClient = useSuiClient() as SuiClient
  const { account } = useWallet()

  const {
    data: coins,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['sui-token-balance', account?.address, coinType],
    queryFn: () =>
      !account?.address
        ? undefined
        : suiClient.getCoins({
            owner: account?.address,
            coinType
          }),
    enabled: !!coinType && !!account?.address
  })

  const { data: coinMetadata } = useQuery({
    queryKey: ['sui-token-metadata', coinType],
    queryFn: () =>
      suiClient.getCoinMetadata({
        coinType
      }),
    enabled: !!coinType
  })

  const addCoinObject = useCallback(
    (tx: Transaction) => {
      if (!coins?.data?.length) return
      if (coins?.data?.length === 1) return coins?.data?.[0]
      const [primaryCoin, ...mergeCoins] = coins?.data || []
      // https://sdk.mystenlabs.com/typescript/transaction-building/basics#transactions
      const primaryCoinInput = tx.object(primaryCoin.coinObjectId)
      if (mergeCoins.length) {
        tx.mergeCoins(
          primaryCoinInput,
          mergeCoins.map((coin) => tx.object(coin.coinObjectId))
        )
      }
      return primaryCoin
    },
    [coins]
  )

  const balanceAsMist = useMemo(() => {
    return (
      coins?.data?.reduce((prev, current) => {
        if (current?.balance) {
          return prev + BigInt(current?.balance)
        }
        return prev
      }, BigInt(0)) || 0
    )
  }, [coins?.data])

  const balance = useMemo(() => {
    return Number(parseFromMist(balanceAsMist, coinMetadata?.decimals ?? 0))
  }, [balanceAsMist, coinMetadata?.decimals])

  const coinId = useMemo(() => coins?.data?.[0]?.coinObjectId, [coins])

  return {
    coinId,
    coins,
    coinMetadata,
    balance,
    isFetching,
    addCoinObject,
    refetchBalance: refetch
  }
}
