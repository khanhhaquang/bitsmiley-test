import { useMemo, useState } from 'react'
import { Address, formatEther } from 'viem'
import { useWriteContract } from 'wagmi'

import airdropAbi from '@/abi/BitSmileyMerkleErc20Airdrop.json'
import {
  useReadAirdropAirdrop,
  useReadAirdropCanClaim,
  useReadAirdropClaimed
} from '@/contracts/Airdrop'
import { useStoreActions } from '@/hooks/useStoreActions'

export const useAirdrop = (airdropAddress?: Address) => {
  const { data: airdropInfo, isLoading: isLoadingAirdropInfo } =
    useReadAirdropAirdrop({
      address: airdropAddress,
      query: {
        select: ([
          token,
          receivedUsers,
          merkleTreeRoot,
          endTime,
          createdBy,
          startTime,
          totalReceived,
          totalAllocation
        ]) => ({
          token,
          receivedUsers,
          merkleTreeRoot,
          endTime: endTime.toString(),
          createdBy: createdBy.toString(),
          startTime: startTime.toString(),
          totalReceived: formatEther(totalReceived),
          totalAllocation: formatEther(totalAllocation)
        })
      }
    })

  const { data: isClaimed, isLoading: isLoadingClaimed } =
    useReadAirdropClaimed({ address: airdropAddress })
  const { data: canClaim, isLoading: isLoadingCanClaim } =
    useReadAirdropCanClaim({ address: airdropAddress })

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
        args: []
      })
      addTransaction(txId)
    } catch (e) {
      console.error(e)
    } finally {
      setIsClaiming(false)
    }
  }

  const isLoading = useMemo(
    () => isLoadingAirdropInfo || isLoadingClaimed || isLoadingCanClaim,
    [isLoadingAirdropInfo, isLoadingCanClaim, isLoadingClaimed]
  )

  return { airdropInfo, isClaimed, canClaim, isLoading, claim, isClaiming }
}
