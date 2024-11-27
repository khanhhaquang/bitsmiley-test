import { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useMutation } from '@tanstack/react-query'
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
    try {
      const result = await signAndExecute(tx)
      if (result?.digest) {
        const waitResult = await client.waitForTransaction({
          digest: result.digest,
          ...options
        })

        then?.(waitResult)
        setTxResponse(waitResult)
      }
      return
    } catch (error) {
      console.error('Failed to execute transaction', tx, error)
    }
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
