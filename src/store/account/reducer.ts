import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { RootState } from '@/store/rootReducer'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'

const initState: {
  loginType: string
  accountInfo: IAccountInfo
} = {
  loginType:
    getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE) || LoginTypeEnum.None,
  accountInfo: {
    address: '',
    publicKey: ''
  }
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_ACCOUNT_INFO, (state, action) => {
    state.accountInfo = action.payload
  }),
    builder.addCase(actions.SET_LOGIN_TYPE, (state, action) => {
      state.loginType = action.payload
      setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, action.payload)
    })
})

export const getAccountInfo = (state: RootState) => state.account.accountInfo
export const getLoginType = (state: RootState) => state.account.loginType
export const getIsConnected = (state: RootState) =>
  !!state.account.accountInfo.address &&
  (state.account.accountInfo.address) !== 'undefined' &&
  !!state.account.loginType &&
  state.account.loginType !== LoginTypeEnum.None
