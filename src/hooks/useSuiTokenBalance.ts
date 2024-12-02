import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { parseFromMist } from '@/utils/sui'

export const useSuiTokenBalance = (coinType: string) => {
  const suiClient = useSuiClient() as SuiClient
  const { account } = useWallet()

  const getSuiTokenBalance = async (owner: string, coinType: string) => {
    const coins = await suiClient.getCoins({
      owner,
      coinType
    })
    return coins
  }

  const {
    data: coins,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['sui-token-balance', account?.address, coinType],
    queryFn: () => getSuiTokenBalance(account?.address as string, coinType),
    enabled: Boolean(account?.address && coinType)
  })

  const balance = useMemo(() => {
    const coinBalance = coins?.data?.reduce((prev, current) => {
      if (current?.balance) {
        return prev + BigInt(current?.balance)
      }
      return prev
    }, BigInt(0))
    if (coinBalance) return Number(parseFromMist(BigInt(coinBalance)))
    return 0
  }, [coins])

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

  return {
    coins,
    balance: balance || 0,
    refetchBalance: refetch,
    isFetching,
    addCoinObject
  }
}
