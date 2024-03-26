import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
  useReadStakingContractGetStakeRewards,
  useReadStakingContractGetUserStakes,
  useReadStakingContractPerAddressLimit,
  useReadStakingContractStakingEnded
} from '@/contracts/Staking'
import { getTransactions } from '@/store/common/reducer'

import { useContractAddresses } from './useContractAddresses'
import { useUserInfo } from './useUserInfo'

export const useUserStakes = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()
  const transactions = useSelector(getTransactions)

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
    stakeRewards
  }
}
