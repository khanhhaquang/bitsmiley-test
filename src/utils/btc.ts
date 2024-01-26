import {
  validate,
  getAddressInfo,
  Network,
  AddressType
} from 'bitcoin-address-validation'

export const validateTaprootAddress = (address: string) => {
  const isValidate = validate(address)

  if (!isValidate) return false

  const addressInfo = getAddressInfo(address)

  return (
    addressInfo.network === Network.mainnet &&
    addressInfo.type === AddressType.p2tr
  )
}
