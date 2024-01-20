import { createAction } from '@reduxjs/toolkit'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'account/SET_CURRENT_TYPEWRITTER_SEQ'
)
const SET_REMAIN_COUNT_DOWN = createAction<number>(
  'account/SET_REMAIN_COUNT_DOWN'
)

export default {
  SET_CURRENT_TYPEWRITTER_SEQ,
  SET_REMAIN_COUNT_DOWN
}
