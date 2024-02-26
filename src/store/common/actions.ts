import { createAction } from '@reduxjs/toolkit'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'common/SET_CURRENT_TYPEWRITTER_SEQ'
)

const SET_NETWORK_ERROR = createAction<boolean>('comman/SET_NETWORK_ERROR')
const ADD_TRANSACTION = createAction<string>('comman/ADD_TRANSACTIONS')
const REMOVE_TRANSACTION = createAction<string>('comman/REMOVE_TRANSACTION')

export default {
  SET_CURRENT_TYPEWRITTER_SEQ,
  SET_NETWORK_ERROR,
  ADD_TRANSACTION,
  REMOVE_TRANSACTION
}
