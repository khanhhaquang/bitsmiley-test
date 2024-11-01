import { createAction } from '@reduxjs/toolkit'

const SET_LOGGED_IN = createAction<boolean>('airdrop/SET_LOGGED_IN')

export default {
  SET_LOGGED_IN
}
