import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  Address,
  decodeFunctionResult,
  encodeFunctionData,
  erc20Abi,
  formatEther,
  parseEther
} from 'viem'
import { useChainId, useWriteContract } from 'wagmi'

import airdropAbi from '@/abi/BitSmileyMerkleErc20Airdrop.json'
import {
  useReadAirdropCanClaim,
  useReadAirdropClaimed
} from '@/contracts/Airdrop'
import { useStoreActions } from '@/hooks/useStoreActions'
import { useSupportedChains } from '@/hooks/useSupportedChains'
import { useUserInfo } from '@/hooks/useUserInfo'
import { UserService } from '@/services/user'

export const useAirdrop = (chainId?: number, airdropAddress?: Address) => {
  const currentChainId = useChainId()
  const { address: userAddress } = useUserInfo()
  const { clients } = useSupportedChains()
  const client = clients.find((c) => c.chain.id === chainId)

  const { data: airdropInfo, isLoading: isLoadingAirdropInfo } = useQuery({
    queryKey: [chainId, airdropAddress],
    queryFn:
      !client || !airdropAddress
        ? undefined
        : async () => {
            const airdropRes = await client.request({
              method: 'eth_call',
              params: [
                {
                  data: encodeFunctionData({
                    abi: airdropAbi,
                    functionName: 'airdrop'
                  }),
                  to: airdropAddress
                }
              ]
            })

            const [
              receivedUsers,
              createdBy,
              token,
              startTime,
              endTime,
              merkleTreeRoot,
              totalAllocation,
              totalReceived
            ] =
              (decodeFunctionResult({
                abi: airdropAbi,
                functionName: 'airdrop',
                data: airdropRes
              }) as
                | [
                    number,
                    Address,
                    Address,
                    bigint,
                    bigint,
                    Address,
                    bigint,
                    bigint
                  ]
                | undefined) || []

            return {
              token,
              receivedUsers,
              merkleTreeRoot,
              endTime: endTime?.toString(),
              createdBy: createdBy?.toString(),
              startTime: startTime?.toString(),
              totalReceived: formatEther(totalReceived || BigInt('0')),
              totalAllocation: formatEther(totalAllocation || BigInt('0'))
            }
          }
  })

  const { data: tokenInfo, isLoading: isLoadingTokenInfo } = useQuery({
    queryKey: [chainId, airdropInfo?.token],
    enabled: !!client && !!airdropInfo?.token,
    queryFn:
      !client || !airdropInfo?.token
        ? undefined
        : async () => {
            const nameRes = await client.request({
              method: 'eth_call',
              params: [
                {
                  data: encodeFunctionData({
                    abi: erc20Abi,
                    functionName: 'name'
                  }),
                  to: airdropInfo?.token
                }
              ]
            })

            const name = decodeFunctionResult({
              abi: erc20Abi,
              functionName: 'name',
              data: nameRes
            })

            const symbolRes = await client.request({
              method: 'eth_call',
              params: [
                {
                  data: encodeFunctionData({
                    abi: erc20Abi,
                    functionName: 'symbol'
                  }),
                  to: airdropInfo?.token
                }
              ]
            })

            const symbol = decodeFunctionResult({
              abi: erc20Abi,
              functionName: 'symbol',
              data: symbolRes
            })

            return { name, symbol }
          }
  })

  const {
    data: airdropProofAndAmount,
    isLoading: isLoadingAirdropProofAndAmount
  } = useQuery({
    queryKey: [
      UserService.getAirdropProofAndAmount.key,
      chainId,
      currentChainId,
      userAddress,
      airdropAddress
    ],
    queryFn: () =>
      !!chainId && !!airdropAddress && !!userAddress
        ? UserService.getAirdropProofAndAmount.call(
            chainId,
            userAddress,
            airdropAddress
          )
        : undefined,
    enabled:
      !!chainId &&
      !!airdropAddress &&
      !!userAddress &&
      currentChainId === chainId,
    select: (res) =>
      !res
        ? undefined
        : {
            ...res.data,
            amount: formatEther(BigInt(res?.data.amount || ''))
          }
  })

  const {
    data: isClaimed,
    isLoading: isLoadingClaimed,
    refetch: refetchIsClaimed,
    isRefetching: isRefetchingIsClaimed
  } = useReadAirdropClaimed({
    address: airdropAddress,
    args: userAddress && [userAddress],
    query: {
      enabled: !!airdropInfo?.token && currentChainId === chainId
    }
  })
  const {
    data: canClaim,
    isLoading: isLoadingCanClaim,
    refetch: refetchCanClaim,
    isRefetching: isRefetchingCanClaim
  } = useReadAirdropCanClaim({
    address: airdropAddress,
    args:
      !!userAddress &&
      !!airdropProofAndAmount?.amount &&
      !!airdropProofAndAmount?.proof?.length
        ? [
            userAddress,
            parseEther(airdropProofAndAmount.amount),
            airdropProofAndAmount.proof
          ]
        : undefined,
    query: {
      enabled: !!airdropInfo?.token && currentChainId === chainId
    }
  })

  const { addTransaction } = useStoreActions()
  const { writeContractAsync } = useWriteContract()
  const [isClaiming, setIsClaiming] = useState(false)

  const claim = async () => {
    if (!airdropAddress || isClaiming) return

    try {
      setIsClaiming(true)
      const txId = await writeContractAsync({
        abi: airdropAbi,
        address: airdropAddress,
        functionName: 'claim',
        args:
          !!airdropProofAndAmount?.amount &&
          !!airdropProofAndAmount?.proof?.length
            ? [
                parseEther(airdropProofAndAmount.amount),
                airdropProofAndAmount.proof
              ]
            : undefined
      })
      addTransaction(txId)
      refetchIsClaimed()
      refetchCanClaim()
    } catch (e) {
      console.error(e)
    } finally {
      setIsClaiming(false)
    }
  }

  const isLoading = useMemo(
    () =>
      isLoadingAirdropProofAndAmount ||
      isLoadingAirdropInfo ||
      isLoadingTokenInfo ||
      isLoadingClaimed ||
      isLoadingTokenInfo ||
      isLoadingCanClaim,
    [
      isLoadingAirdropInfo,
      isLoadingAirdropProofAndAmount,
      isLoadingCanClaim,
      isLoadingClaimed,
      isLoadingTokenInfo
    ]
  )

  const isRefetching = useMemo(
    () => isRefetchingCanClaim || isRefetchingIsClaimed,
    [isRefetchingCanClaim, isRefetchingIsClaimed]
  )

  return {
    tokenInfo,
    isLoadingTokenInfo,
    airdropProofAndAmount,
    isClaimed,
    canClaim,
    isLoading,
    isRefetching,
    isLoadingAirdropProofAndAmount,
    claim,
    isClaiming
  }
}
