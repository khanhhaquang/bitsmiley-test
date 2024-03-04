import { IFeaturesEnabled, IProject } from '@/services/project'
import { createAction } from '@reduxjs/toolkit'
import { Hash } from 'viem'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'common/SET_CURRENT_TYPEWRITTER_SEQ'
)

const SET_NETWORK_ERROR = createAction<boolean>('comman/SET_NETWORK_ERROR')
const ADD_TRANSACTION = createAction<Hash>('comman/ADD_TRANSACTION')
const ADD_TRANSACTIONS = createAction<Hash[]>('comman/ADD_TRANSACTIONS')
const REMOVE_TRANSACTION = createAction<string>('comman/REMOVE_TRANSACTION')
const SET_PROJECT_INFO = createAction<IProject>('common/SET_PROJECT_INFO')
const SET_FEATURESENABLED_INFO = createAction<IFeaturesEnabled>(
  'common/SET_FEATURESENABLED_INFO'
)
export default {
  SET_CURRENT_TYPEWRITTER_SEQ,
  SET_NETWORK_ERROR,
  ADD_TRANSACTION,
  ADD_TRANSACTIONS,
  REMOVE_TRANSACTION,
  SET_PROJECT_INFO,
  SET_FEATURESENABLED_INFO
}
