import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { RootState } from '@/store/rootReducer'

const initState: {
  currentTypewritterSeq: number
  remainCountdown: number
} = {
  currentTypewritterSeq: 0,
  remainCountdown: 0
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_CURRENT_TYPEWRITTER_SEQ, (state, action) => {
    state.currentTypewritterSeq = action.payload
  })
  builder.addCase(actions.SET_REMAIN_COUNT_DOWN, (state, action) => {
    state.remainCountdown = action.payload
  })
})

export const getCurrentTypeWritterSeq = (state: RootState) =>
  state.common.currentTypewritterSeq
export const getRemainCountdown = (state: RootState) =>
  state.common.remainCountdown
