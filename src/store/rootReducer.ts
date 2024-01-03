import { combineReducers, configureStore } from '@reduxjs/toolkit'
import account from './account'
import common from './common'

const allReducers = combineReducers({
  account: account.reducer,
  common: common.reducer
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rootReducer = (state: any, action: { type: string }) => {
  if (action.type === 'LOGOUT') {
    return allReducers(undefined, action)
  }

  return allReducers(state, action)
}

export type RootState = ReturnType<typeof rootReducer>

export const rootStore = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV
})
