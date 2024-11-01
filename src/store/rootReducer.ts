import { combineReducers, configureStore } from '@reduxjs/toolkit'

import airdrop from './airdrop'
import common from './common'

const allReducers = combineReducers({
  common: common.reducer,
  airdrop: airdrop.reducer
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rootReducer = (state: any, action: { type: string }) => {
  if (action.type === 'LOGOUT') {
    return allReducers(undefined, action)
  }

  return allReducers(state, action)
}

export type RootState = ReturnType<typeof allReducers>

const rootStore = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV
})

export default rootStore
