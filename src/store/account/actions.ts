import { createAction } from '@reduxjs/toolkit'

import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { AddressStauts } from '@/types/status'

const SET_TX_ID = createAction<string | undefined>('account/SET_TX_ID')
const SET_ACCOUNT_INFO = createAction<IAccountInfo>('account/SET_ACCOUNT_INFO')
const SET_LOGIN_TYPE = createAction<LoginTypeEnum>('account/SET_LOGIN_TYPE')
const SET_ADDRESS_STATUS = createAction<AddressStauts>(
  'account/SET_ADDRESS_STATUS'
)
const SET_IS_CREATING_ORDER = createAction<boolean>(
  'account/SET_IS_CREATING_ORDER'
)

export default {
  SET_ACCOUNT_INFO,
  SET_LOGIN_TYPE,
  SET_TX_ID,
  SET_ADDRESS_STATUS,
  SET_IS_CREATING_ORDER
}
