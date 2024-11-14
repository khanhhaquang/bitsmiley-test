import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWriteContract } from 'wagmi'

import stakingAbi from '@/abi/Staking.json'
import {
  useReadStakingContractGetStakeRewards,
  useReadStakingContractGetUserStakes,
  useReadStakingContractPerAddressLimit,
  useReadStakingContractStakingEnded
} from '@/contracts/Staking'
import { getTransactions } from '@/store/common/reducer'

import { useContractAddresses } from './useContractAddresses'
import { useStoreActions } from './useStoreActions'
import { useUserInfo } from './useUserInfo'

export const useUserStakes = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()
  const transactions = useSelector(getTransactions)
  const { addTransaction } = useStoreActions()
  const { writeContractAsync } = useWriteContract()

  const [isClaiming, setIsClaiming] = useState(false)

  const stakingAddress = contractAddresses?.staking
    ? contractAddresses?.staking
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
      isFetchingPerAddressLimit,
    [isFetchingIsStakingEnded, isFetchingUserStakes, isFetchingPerAddressLimit]
  )

  const handleWithdraw = async (callback?: (error?: unknown) => void) => {
    if (contractAddresses?.staking) {
      try {
        setIsClaiming(true)
        const txid = await writeContractAsync({
          abi: stakingAbi,
          functionName: 'withdraw',
          address: contractAddresses.staking
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return {
    userStakes,
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
