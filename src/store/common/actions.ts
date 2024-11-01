import { createAction } from '@reduxjs/toolkit'
import { Hash } from 'viem'

import { IProject } from '@/services/project'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'common/SET_CURRENT_TYPEWRITTER_SEQ'
)

const SET_NETWORK_ERROR = createAction<boolean>('common/SET_NETWORK_ERROR')
const ADD_TRANSACTION = createAction<Hash>('common/ADD_TRANSACTION')
const ADD_TRANSACTIONS = createAction<Hash[]>('common/ADD_TRANSACTIONS')
const REMOVE_TRANSACTION = createAction<string>('common/REMOVE_TRANSACTION')
const SET_PROJECT_INFO = createAction<IProject>('common/SET_PROJECT_INFO')

export default {
  SET_CURRENT_TYPEWRITTER_SEQ,
  SET_NETWORK_ERROR,
  ADD_TRANSACTION,
  ADD_TRANSACTIONS,
  REMOVE_TRANSACTION,
  SET_PROJECT_INFO
}
