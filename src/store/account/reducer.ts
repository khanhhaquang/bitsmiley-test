import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { RootState } from '@/store/rootReducer'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { InscribeStatus } from '@/types/status'

const initState: {
  loginType: string
  accountInfo: IAccountInfo
  txid: string
  inscriptionStatus: InscribeStatus
} = {
  loginType:
    getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE) || LoginTypeEnum.None,
  accountInfo: {
    address: '',
    publicKey: ''
  },
  txid: getLocalStorage(LOCAL_STORAGE_KEYS.TXID) || '',
  inscriptionStatus: InscribeStatus.Promotion
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_ACCOUNT_INFO, (state, action) => {
    state.accountInfo = action.payload
  })

  builder.addCase(actions.SET_LOGIN_TYPE, (state, action) => {
    state.loginType = action.payload
    setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, action.payload)
  })

  builder.addCase(actions.SET_TX_ID, (state, action) => {
    state.txid = action.payload
    setLocalStorage(LOCAL_STORAGE_KEYS.TXID, action.payload)
  })

  builder.addCase(actions.SET_INSCRIPTION_STATUS, (state, action) => {
    state.inscriptionStatus = action.payload
  })
})

export const getTxId = (state: RootState) => state.account.txid
export const getInscriptionStatus = (state: RootState) =>
  state.account.inscriptionStatus
export const getAccountInfo = (state: RootState) => state.account.accountInfo
export const getLoginType = (state: RootState) => state.account.loginType
export const getIsConnected = (state: RootState) =>
  !!state.account.accountInfo.address &&
  state.account.accountInfo.address !== 'undefined' &&
  !!state.account.loginType &&
  state.account.loginType !== LoginTypeEnum.None
