import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { RootState } from '@/store/rootReducer'
import { IProject } from '@/services/project'
import { Hash } from 'viem'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'

const initState: {
  networkError: boolean
  currentTypewritterSeq: number
  transactions: Hash[]
  project: IProject | null
} = {
  networkError: false,
  currentTypewritterSeq: 0,
  transactions: (getLocalStorage(LOCAL_STORAGE_KEYS.TXIDS)?.split(',') ||
    []) as Hash[],
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
        const newTxns = state.transactions.concat(action.payload)
        state.transactions = newTxns
        setLocalStorage(LOCAL_STORAGE_KEYS.TXIDS, newTxns.join(','))
      }
    })
    .addCase(actions.ADD_TRANSACTIONS, (state, action) => {
      const filteredTxns = action.payload.filter(
        (v) => !state.transactions.includes(v)
      )
      const newTxns = state.transactions.concat(filteredTxns)
      state.transactions = newTxns
      setLocalStorage(LOCAL_STORAGE_KEYS.TXIDS, newTxns.join(','))
    })
    .addCase(actions.REMOVE_TRANSACTION, (state, action) => {
      const txid = action.payload.toLowerCase()
      const newTxns = state.transactions.filter((v) => v !== txid)
      state.transactions = newTxns
      setLocalStorage(LOCAL_STORAGE_KEYS.TXIDS, newTxns.join(','))
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
