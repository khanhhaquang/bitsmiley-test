import { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

type Options = Omit<
  Parameters<SuiClient['getTransactionBlock']>[0],
  'digest'
> & {
  tx: Transaction
}
type ResponseCallback = (
  tx: SuiTransactionBlockResponse
) => void | Promise<void>
type ExecuteResponse = { digest: string; rawEffects?: number[] }

type Executor = (
  options: Options,
  then?: ResponseCallback
) => Promise<SuiTransactionBlockResponse | undefined>

export type ExecutorResult = {
  validateTransaction: Executor
  status: string
  isIdle: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isPaused: boolean
  executeData?: ExecuteResponse
  error?: Error | null
  reset: () => void
  transactionResponse?: SuiTransactionBlockResponse
}

export const useSuiExecute = (): ExecutorResult => {
  const client = useSuiClient() as SuiClient
  const wallet = useWallet()
  const [txResponse, setTxResponse] = useState<SuiTransactionBlockResponse>()
  const {
    mutateAsync: signAndExecute,
    status,
    isIdle,
    isPending,
    isSuccess,
    isError,
    isPaused,
    reset,
    data,
    error
  } = useMutation({
    mutationFn: async (tx: Transaction) =>
      wallet.signAndExecuteTransaction({
        transaction: tx
      })
  })

  const mutate: Executor = async ({ tx, ...options }, then) => {
    setTxResponse(undefined)
    const result = await signAndExecute(tx)
    if (result?.digest) {
      const waitResult = await client.waitForTransaction({
        digest: result.digest,
        ...options
      })

      then?.(waitResult)
      setTxResponse(waitResult)
      return waitResult
    }
    throw new Error('Failed to execute transaction')
  }

  return {
    validateTransaction: mutate,
    status,
    isIdle,
    isPending,
    isSuccess,
    isError,
    isPaused,
    error,
    executeData: data,
    reset,
    transactionResponse: txResponse
  }
}
