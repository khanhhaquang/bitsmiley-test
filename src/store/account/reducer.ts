import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { RootState } from '@/store/rootReducer'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'

const initState: {
  loginType: LoginTypeEnum
  accountInfo: IAccountInfo
} = {
  loginType:
    (getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE) as LoginTypeEnum) ||
    LoginTypeEnum.None,
  accountInfo: {
    address: getLocalStorage(LOCAL_STORAGE_KEYS.ADDRESS) || '',
    publicKey: getLocalStorage(LOCAL_STORAGE_KEYS.PUBLIC_KEY) || '',
    compressedPublicKey:
      getLocalStorage(LOCAL_STORAGE_KEYS.COMPRESSED_PUBLIC_KEY) || ''
  }
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_ACCOUNT_INFO, (state, action) => {
    state.accountInfo = action.payload

    setLocalStorage(LOCAL_STORAGE_KEYS.ADDRESS, action.payload.address)
    setLocalStorage(LOCAL_STORAGE_KEYS.PUBLIC_KEY, action.payload.publicKey)
    setLocalStorage(
      LOCAL_STORAGE_KEYS.COMPRESSED_PUBLIC_KEY,
      action.payload.compressedPublicKey || ''
    )
  }),
    builder.addCase(actions.SET_LOGIN_TYPE, (state, action) => {
      state.loginType = action.payload
      setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, action.payload)
    })
})

export const getAccountInfo = (state: RootState) => state.account.accountInfo
export const getLoginType = (state: RootState) => state.account.loginType
export const getIsConnected = (state: RootState) =>
  !!state.account.accountInfo.address && !!state.account.loginType
