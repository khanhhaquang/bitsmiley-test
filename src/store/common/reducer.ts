import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { RootState } from '@/store/rootReducer'

const initState: {
  networkError: boolean
  isOpenHistory: boolean
  currentTypewritterSeq: number
} = {
  networkError: false,
  isOpenHistory: false,
  currentTypewritterSeq: 0
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_CURRENT_TYPEWRITTER_SEQ, (state, action) => {
    state.currentTypewritterSeq = action.payload
  })
  builder.addCase(actions.SET_IS_OPEN_HISTORY, (state, action) => {
    state.isOpenHistory = action.payload
  })
  builder.addCase(actions.SET_NETWORK_ERROR, (state, action) => {
    state.networkError = action.payload
  })
})

export const getCurrentTypeWritterSeq = (state: RootState) =>
  state.common.currentTypewritterSeq

export const getIsOpenHistory = (state: RootState) => state.common.isOpenHistory
export const getNetworkError = (state: RootState) => state.common.networkError
