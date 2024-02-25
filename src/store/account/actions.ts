import { createAction } from '@reduxjs/toolkit'

import { IAccountInfo, LoginTypeEnum } from '@/types/common'

const SET_ACCOUNT_INFO = createAction<IAccountInfo>('account/SET_ACCOUNT_INFO')
const SET_LOGIN_TYPE = createAction<LoginTypeEnum | undefined>(
  'account/SET_LOGIN_TYPE'
)

export default {
  SET_ACCOUNT_INFO,
  SET_LOGIN_TYPE
}
