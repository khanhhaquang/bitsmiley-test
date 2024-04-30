import { useQueries } from '@tanstack/react-query'
import sum from 'lodash/sum'
import { useMemo } from 'react'
import { decodeFunctionResult, encodeFunctionData, formatEther } from 'viem'

import { vaultAbi } from '@/contracts/Vault'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useSupportedChains } from '@/hooks/useSupportedChains'
import { formatNumberAsCompact } from '@/utils/number'

export const useTVL = () => {
  const { projectInfo } = useProjectInfo()
  const { clients } = useSupportedChains()

  const queryRes = useQueries({
    queries: clients.map((client) => ({
      retry: 5,
      retryDelay: 10000,
      queryKey: ['tvl', client.chain.id],
      queryFn: async () => {
        const contractAddress = projectInfo?.web3Info.find(
          (w) => w.chainId === client.chain.id
        )?.contract.VaultManager

        if (!contractAddress) return 0n

        const debtRes = await client.request({
          method: 'eth_call',
          params: [
            {
              data: encodeFunctionData({
                abi: vaultAbi,
                functionName: 'debt'
              }),
              to: contractAddress
            },
            'latest'
          ]
        })

        const debt = decodeFunctionResult({
          abi: vaultAbi,
          functionName: 'debt',
          data: debtRes
        })

        return debt
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
