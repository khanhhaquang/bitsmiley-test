import { createAction } from '@reduxjs/toolkit'

import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { INft } from '@/services/user'

const SET_TX_ID = createAction<string | undefined>('account/SET_TX_ID')
const SET_INSCRIPTION_ID = createAction<string | undefined>(
  'account/SET_INSCRIPTION_ID'
)
const SET_ACCOUNT_INFO = createAction<IAccountInfo>('account/SET_ACCOUNT_INFO')
const SET_LOGIN_TYPE = createAction<LoginTypeEnum>('account/SET_LOGIN_TYPE')
const SET_IS_CREATING_ORDER = createAction<boolean>(
  'account/SET_IS_CREATING_ORDER'
)
const SET_USER_NFTS = createAction<INft[]>('account/SET_USER_NFTS')

export default {
  SET_ACCOUNT_INFO,
  SET_LOGIN_TYPE,
  SET_TX_ID,
  SET_INSCRIPTION_ID,
  SET_IS_CREATING_ORDER,
  SET_USER_NFTS
}
