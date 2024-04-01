import {
  ExecutionRevertedError,
  InsufficientFundsError,
  UnknownNodeError
} from 'viem'

export const getTxnErrorMsg = (e: unknown) => {
  if (
    e instanceof InsufficientFundsError ||
    e instanceof ExecutionRevertedError ||
    e instanceof UnknownNodeError
  ) {
    return e.shortMessage
  }

  return 'Something went wrong, please try again.'
}
