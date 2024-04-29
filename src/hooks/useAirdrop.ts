import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { formatEther, parseEther } from 'viem'
import { useChainId, useWriteContract } from 'wagmi'

import airdropAbi from '@/abi/BitSmileyMerkleErc20Airdrop.json'
import {
  useReadAirdropCanClaim,
  useReadAirdropClaimed
} from '@/contracts/Airdrop'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useStoreActions } from '@/hooks/useStoreActions'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IAirdrop } from '@/services/project'
import { UserService } from '@/services/user'

export const useAirdrop = (airdrop?: IAirdrop) => {
  const currentChainId = useChainId()
  const { projectInfo } = useProjectInfo()
  const { address: userAddress } = useUserInfo()

  const airdrops = useMemo(
    () =>
      projectInfo?.web3Info
        ?.map((w) =>
          w.contract.airdrop.map((a) => ({ ...a, chainId: w.chainId }))
        )
        .flatMap((i) => i),
    [projectInfo?.web3Info]
  )

  const {
    data: airdropProofAndAmount,
    isLoading: isLoadingAirdropProofAndAmount
  } = useQuery({
    queryKey: [
      UserService.getAirdropProofAndAmount.key,
      currentChainId,
      userAddress,
      airdrop?.chainId,
      airdrop?.airdropContractAddress
    ],
    queryFn: () =>
      !!airdrop?.airdropContractAddress && !!userAddress
        ? UserService.getAirdropProofAndAmount.call(
            airdrop.chainId,
            userAddress,
            airdrop.airdropContractAddress
          )
        : undefined,
    enabled:
      !!airdrop?.airdropContractAddress &&
      !!userAddress &&
      currentChainId === airdrop.chainId,
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
    address: airdrop?.airdropContractAddress,
    args: userAddress && [userAddress],
    query: {
      enabled: currentChainId === airdrop?.chainId
    }
  })
  const {
    data: canClaim,
    isLoading: isLoadingCanClaim,
    refetch: refetchCanClaim,
    isRefetching: isRefetchingCanClaim
  } = useReadAirdropCanClaim({
    address: airdrop?.airdropContractAddress,
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
      enabled: currentChainId === airdrop?.chainId
    }
  })

  const { addTransaction } = useStoreActions()
  const { writeContractAsync } = useWriteContract()
  const [isClaiming, setIsClaiming] = useState(false)

  const claim = async () => {
    if (!airdrop?.airdropContractAddress || isClaiming) return

    try {
      setIsClaiming(true)
      const txId = await writeContractAsync({
        abi: airdropAbi,
        address: airdrop.airdropContractAddress,
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
      isLoadingAirdropProofAndAmount || isLoadingClaimed || isLoadingCanClaim,
    [isLoadingAirdropProofAndAmount, isLoadingCanClaim, isLoadingClaimed]
  )

  const isRefetching = useMemo(
    () => isRefetchingCanClaim || isRefetchingIsClaimed,
    [isRefetchingCanClaim, isRefetchingIsClaimed]
  )

  return {
    airdrops,
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