import { createAction } from '@reduxjs/toolkit'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'account/SET_CURRENT_TYPEWRITTER_SEQ'
)

const SET_NETWORK_ERROR = createAction<boolean>('account/SET_NETWORK_ERROR')

export default {
  SET_CURRENT_TYPEWRITTER_SEQ,
  SET_NETWORK_ERROR
}
