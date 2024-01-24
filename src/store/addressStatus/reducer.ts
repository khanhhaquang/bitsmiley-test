import { createReducer } from '@reduxjs/toolkit'

import actions from './actions'
import { RootState } from '@/store/rootReducer'
import { AddressStauts } from '@/types/status'

const initState: {
  addressStatus: AddressStauts
} = {
  addressStatus: AddressStauts.NotConnected
}

export default createReducer(initState, (builder) => {
  builder.addCase(actions.SET_ADDRESS_STATUS, (state, action) => {
    state.addressStatus = action.payload
  })
})

export const getAddressStatus = (state: RootState) =>
  state.addressStatus.addressStatus
