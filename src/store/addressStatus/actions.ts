import { AddressStauts } from '@/types/status'
import { createAction } from '@reduxjs/toolkit'

const SET_ADDRESS_STATUS = createAction<AddressStauts>(
  'addressStatus/SET_ADDRESS_STATUS'
)

export default { SET_ADDRESS_STATUS }
