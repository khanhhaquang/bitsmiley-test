import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { RootState } from '@/store/rootReducer'
import { IProject } from '@/services/project'
import { Hash } from 'viem'

const initState: {
  networkError: boolean
  currentTypewritterSeq: number
  transactions: Hash[]
  project: IProject | null
} = {
  networkError: false,
  currentTypewritterSeq: 0,
  transactions: [],
  project: null
}

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_CURRENT_TYPEWRITTER_SEQ, (state, action) => {
      state.currentTypewritterSeq = action.payload
    })
    .addCase(actions.SET_NETWORK_ERROR, (state, action) => {
      state.networkError = action.payload
    })
    .addCase(actions.ADD_TRANSACTION, (state, action) => {
      if (!state.transactions.includes(action.payload)) {
        state.transactions = state.transactions.concat(action.payload)
      }
    })
    .addCase(actions.ADD_TRANSACTIONS, (state, action) => {
      state.transactions = state.transactions.concat(action.payload)
    })
    .addCase(actions.REMOVE_TRANSACTION, (state, action) => {
      const txid = action.payload.toLowerCase()
      state.transactions = state.transactions.filter((v) => v !== txid)
    })
    .addCase(actions.SET_PROJECT_INFO, (state, action) => {
      state.project = action.payload
    })
})

export const getCurrentTypeWritterSeq = (state: RootState) =>
  state.common.currentTypewritterSeq

export const getNetworkError = (state: RootState) => state.common.networkError

export const getTransactions = (state: RootState) => state.common.transactions
export const getProjectInfo = (state: RootState) => state.common.project
