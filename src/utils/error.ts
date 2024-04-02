import {
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ExecutionRevertedError,
  InsufficientFundsError,
  UnknownNodeError
} from 'viem'

const CONTRACT_REVERT_ERRORS: Record<`0x${string}`, string> = {
  '0xad6b0082': 'vault below vault floor',
  '0xe24734c2': 'vault max debt exceeded',
  '0xa90e9e39': 'max debt exceeded',
  '0x019cf77a': 'vault position not safe',
  '0x62d79f99': 'already opened vault',
  '0x17cecebc': 'not enough amount to cover fee'
}

export const getContractRevertErrorMsg = (signature?: `0x${string}`) => {
  console.log('🚀 ~ getContractRevertErrorMsg ~ signature:', signature)

  if (!signature || !CONTRACT_REVERT_ERRORS[signature])
    return 'Contract function reverted with unknown error.'

  return `Contract function reverted error: ${CONTRACT_REVERT_ERRORS[
    signature
  ].toLocaleUpperCase()}`
}

export const getTxnErrorMsg = (e: unknown) => {
  if (e instanceof ContractFunctionRevertedError) {
    return getContractRevertErrorMsg(e.signature)
  }

  if (e instanceof ContractFunctionExecutionError) {
    // SPLIT BY ENTER SYMBOL FROM SHORT MESSAGE
    const shortMessageParts = e.shortMessage.split('\n')
    const signature = shortMessageParts[shortMessageParts.length - 1]
    return getContractRevertErrorMsg(signature as `0x${string}`)
  }

  if (
    e instanceof InsufficientFundsError ||
    e instanceof ExecutionRevertedError ||
    e instanceof UnknownNodeError
  ) {
    return e.shortMessage
  }

  return 'Something went wrong, please try again.'
}
