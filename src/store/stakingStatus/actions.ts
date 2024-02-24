import { StakingStatus } from '@/types/status'
import { createAction } from '@reduxjs/toolkit'

const SET_STAKING_STATUS = createAction<StakingStatus>(
  'addressStatus/SET_STAKING_STATUS'
)

export default { SET_STAKING_STATUS }
