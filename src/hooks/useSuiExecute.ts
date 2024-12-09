import { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

type Options = Omit<
  Parameters<SuiClient['getTransactionBlock']>[0],
  'digest'
> & {
  tx: Transaction
}
type ResponseCallback = (
  tx: SuiTransactionBlockResponse
) => void | Promise<void>

type Executor = (
  options: Options,
  then?: ResponseCallback
) => Promise<SuiTransactionBlockResponse | undefined>

export type ExecutorResult = {
  status: string
  isIdle: boolean
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  isPaused: boolean
  executeData?: SuiSignAndExecuteTransactionOutput
  error?: Error | null
  reset: () => void
  transactionResponse?: SuiTransactionBlockResponse
}

type ExecutorHandler = {
  fetchTransactionResult: (tx: Transaction) => Promise<number[] | undefined>
  validateTransaction: Executor
}

export const useSuiExecute = (): ExecutorResult & ExecutorHandler => {
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

  const fetchTransactionResult = useCallback(
    async (tx: Transaction) => {
      if (!wallet?.address) return undefined

      const res = await client.devInspectTransactionBlock({
        sender: wallet.address,
        transactionBlock: tx
      })

      if (res.error) {
        throw new Error(res.error)
      }
      return res.results![0].returnValues![0][0]
    },
    [client, wallet.address]
  )

  return {
    fetchTransactionResult,
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
