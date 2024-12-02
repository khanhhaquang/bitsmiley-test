import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWriteContract } from 'wagmi'

import stakingAbi from '@/abi/Staking.json'
import {
  useReadStakingContractGetStakeRewards,
  useReadStakingContractGetUserStakes,
  useReadStakingContractPerAddressLimit,
  useReadStakingContractStakingEnded,
  useReadStakingContractWithdrawn
} from '@/contracts/Staking'
import { getTransactions } from '@/store/common/reducer'

import { useContractAddresses } from './useContractAddresses'
import { useStoreActions } from './useStoreActions'
import { useUserInfo } from './useUserInfo'

export const useUserStakes = () => {
  const { evmContractAddresses } = useContractAddresses()
  const { address } = useUserInfo()
  const transactions = useSelector(getTransactions)
  const { addTransaction } = useStoreActions()
  const { writeContractAsync } = useWriteContract()

  const [isClaiming, setIsClaiming] = useState(false)

  const stakingAddress = evmContractAddresses?.staking
    ? evmContractAddresses?.staking
    : undefined

  const {
    data: userStakes,
    isLoading: isFetchingUserStakes,
    refetch: refetchUserStakes
  } = useReadStakingContractGetUserStakes({
    address: stakingAddress,
    args: address && [address]
  })

  const {
    data: isWithdrawn,
    isLoading: isFetchingWithdrawnData,
    refetch: refetchWithdrawnData
  } = useReadStakingContractWithdrawn({
    address: stakingAddress,
    args: address && [address]
  })

  const {
    data: isStakingEnded,
    isLoading: isFetchingIsStakingEnded,
    refetch: refetchStakingState
  } = useReadStakingContractStakingEnded({
    address: stakingAddress
  })

  const { data: perAddressLimit, isLoading: isFetchingPerAddressLimit } =
    useReadStakingContractPerAddressLimit({
      address: stakingAddress
    })

  const { data: stakeRewards, refetch: refetchStakesReward } =
    useReadStakingContractGetStakeRewards({
      address: stakingAddress,
      args: address && [address]
    })

  const jadeBalance = useMemo(
    () =>
      stakeRewards?.reduce((pre, cur) => (pre += Number(cur.reward || 0)), 0),
    [stakeRewards]
  )

  const isFetchingAll = useMemo(
    () =>
      isFetchingUserStakes ||
      isFetchingIsStakingEnded ||
      isFetchingPerAddressLimit ||
      isFetchingWithdrawnData,
    [
      isFetchingIsStakingEnded,
      isFetchingUserStakes,
      isFetchingPerAddressLimit,
      isFetchingWithdrawnData
    ]
  )

  const handleWithdraw = async (callback?: (error?: unknown) => void) => {
    if (evmContractAddresses?.staking) {
      try {
        setIsClaiming(true)
        const txid = await writeContractAsync({
          abi: stakingAbi,
          functionName: 'withdraw',
          address: evmContractAddresses.staking
        })
        addTransaction(txid)
        callback?.()
      } catch (error) {
        console.error(error)
        callback?.(error)
      } finally {
        setIsClaiming(false)
      }
    }
  }

  useEffect(() => {
    refetchStakingState()
    refetchUserStakes()
    refetchStakesReward()
    refetchWithdrawnData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return {
    userStakes,
    isWithdrawn,
    isFetchingAll,
    isFetchingUserStakes,
    isFetchingIsStakingEnded,
    isStakingEnded,
    refetchStakingState,
    refetchUserStakes,
    perAddressLimit,
    jadeBalance,
    stakeRewards,
    stakingAddress,
    isClaiming,
    handleWithdraw
  }
}
