import { createAction } from '@reduxjs/toolkit'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'account/SET_CURRENT_TYPEWRITTER_SEQ'
)

const SET_IS_OPEN_HISTORY = createAction<boolean>('account/SET_IS_OPEN_HISTORY')

export default {
  SET_CURRENT_TYPEWRITTER_SEQ,
  SET_IS_OPEN_HISTORY
}
