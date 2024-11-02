import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { useChainId, useWriteContract } from 'wagmi'

import airdropAbi from '@/abi/BitSmileyMerkleErc20Airdrop.json'
import {
  useReadAirdropCanClaim,
  useReadAirdropClaimed
} from '@/contracts/Airdrop'
import { useStoreActions } from '@/hooks/useStoreActions'
import { useUserInfo } from '@/hooks/useUserInfo'
import { UserService } from '@/services/user'

interface IAirdropInput {
  address?: Address
  chainId?: number
  airdropContractAddress: Address
}

export const useAirdrop = (airdrop?: IAirdropInput) => {
  const currentChainId = useChainId()
  const { address: userAddress } = useUserInfo()

  const {
    data: airdropProofAndAmount,
    isLoading: isLoadingAirdropProofAndAmount
  } = useQuery({
    queryKey: [
      UserService.getAirdropProof.key,
      currentChainId,
      userAddress,
      airdrop?.chainId,
      airdrop?.airdropContractAddress
    ],
    queryFn: () =>
      !!airdrop?.airdropContractAddress && !!userAddress
        ? UserService.getAirdropProof.call(airdrop.airdropContractAddress)
        : undefined,
    enabled:
      !!airdrop?.airdropContractAddress &&
      !!userAddress &&
      currentChainId === airdrop.chainId,
    select: (res) => (!res ? undefined : res.data)
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
            BigInt(airdropProofAndAmount.amount),
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

  const claim = async (onCallback?: (error?: unknown) => void) => {
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
                BigInt(airdropProofAndAmount.amount),
                airdropProofAndAmount.proof
              ]
            : undefined
      })
      addTransaction(txId)
      refetchIsClaimed()
      refetchCanClaim()
      onCallback?.()
    } catch (e) {
      onCallback?.(e)
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
    // airdrops,
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
