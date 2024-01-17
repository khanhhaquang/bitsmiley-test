import { createAction } from '@reduxjs/toolkit'

import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { InscribeStatus } from '@/types/status'

const SET_TX_ID = createAction<string>('account/SET_TX_ID')
const SET_ACCOUNT_INFO = createAction<IAccountInfo>('account/SET_ACCOUNT_INFO')
const SET_LOGIN_TYPE = createAction<LoginTypeEnum>('account/SET_LOGIN_TYPE')
const SET_INSCRIPTION_STATUS = createAction<InscribeStatus>(
  'account/SET_INSCRIPTION_STATUS'
)

export default {
  SET_ACCOUNT_INFO,
  SET_LOGIN_TYPE,
  SET_TX_ID,
  SET_INSCRIPTION_STATUS
}
