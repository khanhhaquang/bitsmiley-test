import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { formatUnits, parseUnits } from 'viem'

export const useSuiToken = (coinType: string) => {
  const suiClient = useSuiClient() as SuiClient
  const { account } = useWallet()

  const getSuiTokenBalance = async (owner: string, coinType: string) => {
    const coins = await suiClient.getCoins({
      owner,
      coinType
    })
    return coins
  }

  const getSuiTokenMeta = async (coinType: string) => {
    const coins = await suiClient.getCoinMetadata({
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
    enabled: Boolean(coinType)
  })

  const { data: coinMetadata } = useQuery({
    queryKey: ['sui-token-metadata', coinType],
    queryFn: () => getSuiTokenMeta(coinType),
    enabled: Boolean(coinType)
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

  const convertToMist = useCallback(
    (value: number | string) => {
      if (!coinMetadata?.decimals) return BigInt(value)
      return parseUnits(value?.toString(), coinMetadata?.decimals)
    },
    [coinMetadata?.decimals]
  )

  const parseFromMist = useCallback(
    (value: bigint) => {
      if (!coinMetadata?.decimals) return value
      return formatUnits(value, coinMetadata?.decimals)
    },
    [coinMetadata?.decimals]
  )

  const balance = useMemo(() => {
    const coinBalance = coins?.data?.reduce((prev, current) => {
      if (current?.balance) {
        return prev + BigInt(current?.balance)
      }
      return prev
    }, BigInt(0))
    if (coinBalance) return Number(parseFromMist(BigInt(coinBalance)))
    return 0
  }, [coins, parseFromMist])

  return {
    coins,
    metadata: coinMetadata,
    balance: balance || 0,
    refetchBalance: refetch,
    isFetching,
    addCoinObject,
    convertToMist,
    parseFromMist
  }
}
