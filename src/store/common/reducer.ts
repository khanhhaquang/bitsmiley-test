import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { RootState } from '@/store/rootReducer'

const initState: {
  currentTypewritterSeq: number
  remainBlock: number
} = {
  currentTypewritterSeq: 0,
  remainBlock: 0
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_CURRENT_TYPEWRITTER_SEQ, (state, action) => {
    state.currentTypewritterSeq = action.payload
  })
  builder.addCase(actions.SET_REMAIN_BLOCK, (state, action) => {
    state.remainBlock = action.payload
  })
})

export const getCurrentTypeWritterSeq = (state: RootState) =>
  state.common.currentTypewritterSeq
export const getRemainBlock = (state: RootState) => state.common.remainBlock
