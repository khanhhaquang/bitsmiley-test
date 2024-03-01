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
  transactions: { [key: string]: Hash[] }
  project: IProject | null
} = {
  networkError: false,
  currentTypewritterSeq: 0,
  transactions: JSON.parse(getLocalStorage(LOCAL_STORAGE_KEYS.TXIDS) || ''),
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
      const targetTxns = (state.transactions[action.payload.address] ||
        []) as Hash[]
      if (!targetTxns.includes(action.payload.txid)) {
        state.transactions[action.payload.address] = targetTxns.concat(
          action.payload.txid
        )

        setLocalStorage(
          LOCAL_STORAGE_KEYS.TXIDS,
          JSON.stringify(state.transactions)
        )
      }
    })
    .addCase(actions.REMOVE_TRANSACTION, (state, action) => {
      const targetTxns = state.transactions[action.payload.address] || []
      const newTxns = targetTxns.filter((v) => v !== action.payload.txid)
      if (newTxns.length) {
        state.transactions[action.payload.address] = newTxns
        setLocalStorage(
          LOCAL_STORAGE_KEYS.TXIDS,
          JSON.stringify(state.transactions)
        )
      }
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
