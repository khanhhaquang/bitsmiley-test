import { IProject } from '@/services/project'
import { ITransactionInfo } from '@/types/common'
import { createAction } from '@reduxjs/toolkit'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'common/SET_CURRENT_TYPEWRITTER_SEQ'
)

const SET_NETWORK_ERROR = createAction<boolean>('comman/SET_NETWORK_ERROR')
const ADD_TRANSACTION = createAction<ITransactionInfo>('comman/ADD_TRANSACTION')
const REMOVE_TRANSACTION = createAction<ITransactionInfo>(
  'comman/REMOVE_TRANSACTION'
)
const SET_PROJECT_INFO = createAction<IProject>('common/SET_PROJECT_INFO')
export default {
  SET_CURRENT_TYPEWRITTER_SEQ,
  SET_NETWORK_ERROR,
  ADD_TRANSACTION,
  REMOVE_TRANSACTION,
  SET_PROJECT_INFO
}
