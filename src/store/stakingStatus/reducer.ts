import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { RootState } from '@/store/rootReducer'
import { StakingStatus } from '@/types/status'

const initState: {
  stakingStatus: StakingStatus
} = {
  stakingStatus: StakingStatus.NotConnected
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_STAKING_STATUS, (state, action) => {
    state.stakingStatus = action.payload
  })
})

export const getStakingStatus = (state: RootState) =>
  state.stakingStatus.stakingStatus
