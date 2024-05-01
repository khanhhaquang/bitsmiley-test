import { useQueries } from '@tanstack/react-query'
import sum from 'lodash/sum'
import { useMemo } from 'react'
import { decodeFunctionResult, encodeFunctionData, formatEther } from 'viem'

import { bitSmileyQueryAbi } from '@/contracts/BitSmileyQuery'
import { erc20Abi } from '@/contracts/ERC20'
import { oracleAbi } from '@/contracts/Oracle'
import { vaultAbi } from '@/contracts/Vault'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useSupportedChains } from '@/hooks/useSupportedChains'
import { formatNumberAsCompact } from '@/utils/number'

// wBtc * price + bitusd
export const useTVL = () => {
  const { projectInfo } = useProjectInfo()
  const { clients } = useSupportedChains()

  const queryRes = useQueries({
    queries: clients.map((client) => ({
      retry: 5,
      retryDelay: 10000,
      queryKey: ['tvl', client.chain.id],
      queryFn: async () => {
        const contractAddresses = projectInfo?.web3Info.find(
          (w) => w.chainId === client.chain.id
        )?.contract
        const vaultManagerContractAddress = contractAddresses?.VaultManager

        const wBtcAddress = contractAddresses?.WBTC
        const bitSmileyAddress = contractAddresses?.BitSmiley
        const bitSmileyQueryAddress = contractAddresses?.bitSmileyQuery
        const oracleAddress = contractAddresses?.oracle

        if (
          !oracleAddress ||
          !vaultManagerContractAddress ||
          !wBtcAddress ||
          !bitSmileyAddress
        )
          return 0n

        const wBtcBalanceRes = await client.request({
          method: 'eth_call',
          params: [
            {
              data: encodeFunctionData({
                abi: erc20Abi,
                functionName: 'balanceOf',
                args: [bitSmileyAddress]
              }),
              to: wBtcAddress
            },
            'latest'
          ]
        })

        const wBtcBalance = decodeFunctionResult({
          abi: erc20Abi,
          functionName: 'balanceOf',
          data: wBtcBalanceRes
        })

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

        const collateralId = collaterals[0]?.collateralId

        const priceRes = await client.request({
          method: 'eth_call',
          params: [
            {
              data: encodeFunctionData({
                abi: oracleAbi,
                functionName: 'getPrice',
                args: [collateralId]
              }),
              to: oracleAddress
            },
            'latest'
          ]
        })

        const price = decodeFunctionResult({
          abi: oracleAbi,
          functionName: 'getPrice',
          data: priceRes
        })

        const bitUsdRes = await client.request({
          method: 'eth_call',
          params: [
            {
              data: encodeFunctionData({
                abi: vaultAbi,
                functionName: 'debt'
              }),
              to: vaultManagerContractAddress
            },
            'latest'
          ]
        })

        const bitusd = decodeFunctionResult({
          abi: vaultAbi,
          functionName: 'debt',
          data: bitUsdRes
        })

        if (!price || !wBtcBalance || !bitusd) return 0n

        return price * (wBtcBalance / BigInt(10 ** 18)) + bitusd
      }
    }))
  })

  const isFetching = useMemo(
    () => queryRes.some((q) => q.isFetching),
    [queryRes]
  )

  const tvl = useMemo(
    () => sum(queryRes.filter((i) => i.isSuccess).map((i) => i.data)),
    [queryRes]
  )

  const formatedTvl = useMemo(
    () => (isFetching ? '--' : formatNumberAsCompact(formatEther(BigInt(tvl)))),
    [isFetching, tvl]
  )

  return { isFetching, tvl, formatedTvl }
}
