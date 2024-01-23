import { createAction } from '@reduxjs/toolkit'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'account/SET_CURRENT_TYPEWRITTER_SEQ'
)
const SET_REMAIN_BLOCK = createAction<number>('account/SET_REMAIN_BLOCK')

export default {
  SET_REMAIN_BLOCK,
  SET_CURRENT_TYPEWRITTER_SEQ
}
