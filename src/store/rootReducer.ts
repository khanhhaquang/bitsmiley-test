import { combineReducers, configureStore } from '@reduxjs/toolkit'
import account from './account'
import common from './common'
import addressStatus from './addressStatus'
import stakingStatus from './stakingStatus'

const allReducers = combineReducers({
  addressStatus: addressStatus.reducer,
  stakingStatus: stakingStatus.reducer,
  account: account.reducer,
  common: common.reducer
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rootReducer = (state: any, action: { type: string }) => {
  if (action.type === 'LOGOUT') {
    return allReducers(
      {
        ...state,
        account: undefined,
        common: undefined
      },
      action
    )
  }

  return allReducers(state, action)
}

export type RootState = ReturnType<typeof rootReducer>

const rootStore = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV
})

export default rootStore
