import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '@/store/rootReducer'

import actions from './actions'

const initState: {
  isLoggedIn: boolean
} = {
  isLoggedIn: false
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_LOGGED_IN, (state, action) => {
    state.isLoggedIn = action.payload
  })
})

export const getIsLoggedIn = (state: RootState) => state.airdrop.isLoggedIn
