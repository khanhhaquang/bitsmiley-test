import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import { useState } from 'react'
import { keccak256, toHex } from 'viem'

export const convertToMist = (amount: bigint) => {
  return amount * MIST_PER_SUI
}

export const collateralHash = (collateral: string) => {
  return keccak256(toHex(collateral))
}

export const hexToBytes = (hex: string) => {
  return Buffer.from(hex.slice(2), 'hex')
}

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

type ExecuteCallback = ({
  bytes,
  signature
}: {
  bytes: string
  signature: string
}) => Promise<ExecuteResponse>

type Executor = (options: Options, then?: ResponseCallback) => void

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

export const useSuiExecute = ({
  execute
}: { execute?: ExecuteCallback } = {}): ExecutorResult => {
  const client = useSuiClient()
  const [txResponse, setTxResponse] = useState<SuiTransactionBlockResponse>()
  const {
    mutate: signAndExecute,
    status,
    isIdle,
    isPending,
    isSuccess,
    isError,
    isPaused,
    reset,
    data,
    error
  } = useSignAndExecuteTransaction({ execute })

  const mutate: Executor = ({ tx, ...options }, then) => {
    reset()
    signAndExecute(
      {
        transaction: tx
      },
      {
        onSuccess: ({ digest }) => {
          console.log('digest', digest)
          client.waitForTransaction({ digest, ...options }).then((value) => {
            then?.(value)
            console.log('tx', value)
            setTxResponse(value)
          })
        },

        onError: (error) => {
          console.error('Failed to execute transaction', tx, error)
        }
      }
    )
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
