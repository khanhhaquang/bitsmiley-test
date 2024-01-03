import { createAction } from '@reduxjs/toolkit'

const SET_CURRENT_TYPEWRITTER_SEQ = createAction<number>(
  'account/SET_CURRENT_TYPEWRITTER_SEQ'
)

export default {
  SET_CURRENT_TYPEWRITTER_SEQ
}
