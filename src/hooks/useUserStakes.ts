import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getTransactions } from '@/store/common/reducer'
import {
  useReadStakingContractGetStakeRewards,
  useReadStakingContractGetUserStakes,
  useReadStakingContractStakingEnded
} from '@/contracts/Staking'
import useContractAddresses from './useNetworkAddresses'
import { useUserInfo } from './useUserInfo'

const useUserStakes = () => {
  const contractAddresses = useContractAddresses()
  const { address } = useUserInfo()
  const transactions = useSelector(getTransactions)

  const {
    data: userStakes,
    isLoading: isFetchingUserStakes,
    refetch: refetchUserStakes
  } = useReadStakingContractGetUserStakes({
    address: contractAddresses?.staking,
    args: address && [address]
  })

  const {
    data: isStakingEnded,
    isLoading: isFetchingIsStakingEnded,
    refetch: refetchStakingState
  } = useReadStakingContractStakingEnded({
    address: contractAddresses?.staking
  })

  const { data: stakeRewards, refetch: refetchStakesReward } =
    useReadStakingContractGetStakeRewards({
      address: contractAddresses?.staking,
      args: address && [address]
    })

  const jadeBalance = useMemo(
    () =>
      stakeRewards?.reduce((pre, cur) => (pre += Number(cur.reward || 0)), 0),
    [stakeRewards]
  )

  useEffect(() => {
    refetchStakingState()
    refetchUserStakes()
    refetchStakesReward()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions])

  return {
    userStakes,
    isFetchingUserStakes,
    isFetchingIsStakingEnded,
    isStakingEnded,
    refetchStakingState,
    refetchUserStakes,
    jadeBalance,
    stakeRewards
  }
}

export default useUserStakes
