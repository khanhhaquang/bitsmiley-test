import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { RootState } from '@/store/rootReducer'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { AddressStauts } from '@/types/status'

const initState: {
  loginType: string
  accountInfo: IAccountInfo
  txid?: string
  inscriptionId?: string
  addressStatus: AddressStauts
  isCreatingOrder: boolean
} = {
  loginType:
    getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE) || LoginTypeEnum.None,
  accountInfo: {
    address: '',
    publicKey: ''
  },
  txid: '',
  inscriptionId: '',
  addressStatus: AddressStauts.Promotion,
  isCreatingOrder: false
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
  })

  builder.addCase(actions.SET_ADDRESS_STATUS, (state, action) => {
    state.addressStatus = action.payload
  })

  builder.addCase(actions.SET_IS_CREATING_ORDER, (state, action) => {
    state.isCreatingOrder = action.payload
  })

  builder.addCase(actions.SET_INSCRIPTION_ID, (state, action) => {
    state.inscriptionId = action.payload
  })
})

export const getTxId = (state: RootState) => state.account.txid
export const getInscriptionId = (state: RootState) =>
  state.account.inscriptionId
export const getAddressStatus = (state: RootState) =>
  state.account.addressStatus
export const getAccountInfo = (state: RootState) => state.account.accountInfo
export const getLoginType = (state: RootState) => state.account.loginType
export const getIsCreatingOrder = (state: RootState) =>
  state.account.isCreatingOrder
export const getIsConnected = (state: RootState) =>
  !!state.account.accountInfo.address &&
  state.account.accountInfo.address !== 'undefined' &&
  !!state.account.loginType &&
  state.account.loginType !== LoginTypeEnum.None
