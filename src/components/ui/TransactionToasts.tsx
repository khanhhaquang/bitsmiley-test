import { useChainId, useChains } from 'wagmi'
import { getTransactions } from '@/store/common/reducer'
import { useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { useStoreActions } from '@/hooks/useStoreActions'
import { Hash } from 'viem'
import { SuccessIcon } from '@/assets/icons'
import { useWaitForTransactionReceipt } from 'wagmi'
import { Toast, ToastClose, ToastDescription } from './toast'
import { useUserInfo } from '@/hooks/useUserInfo'

type TransactionToastProps = {
  txnId: Hash
  explorerUrl?: string
}
export const TransactionToast: React.FC<TransactionToastProps> = ({
  txnId,
  explorerUrl
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const { status } = useWaitForTransactionReceipt({ hash: txnId })
  const { removeTransaction } = useStoreActions()

  useEffect(() => {
    if (status !== 'pending') {
      // REOPEN IF USER ACTIVELY CLOSED TOAST PENDING
      setIsOpen(true)
    }
  }, [status])

  return (
    <Toast
      className="w-fit justify-between gap-x-2"
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (status !== 'pending' && !open) {
          // REMOVE FROM CACHE DATA AFTER RESULT RECEIVED WITH TIMEOUT 1s
          setTimeout(() => removeTransaction(txnId), 1000)
        }
      }}>
      <ToastDescription className="flex items-center gap-x-2">
        {status === 'pending' && (
          <p className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        )}
        {status === 'success' && <SuccessIcon />}

        <span>
          {status === 'success' && 'Your transaction succeeded.'}
          {status === 'pending' && 'Transaction processing on-chain...'}
          {status === 'error' && 'Your transaction has failed.'}
        </span>
      </ToastDescription>
      <a
        className="text-green hover:underline"
        target="_blank"
        href={`${explorerUrl}/tx/${txnId}`}>
        [Check]
      </a>
      <ToastClose className="relative" />
    </Toast>
  )
}

export const TransactionToasts: React.FC = () => {
  const { isConnected } = useUserInfo()

  const transactions = useSelector(getTransactions)
  const chains = useChains()
  const chainId = useChainId()
  const chain = useMemo(
    () => chains.find((c) => c.id === chainId),
    [chainId, chains]
  )

  if (!chain?.blockExplorers?.default?.url || !isConnected) return null

  return (
    <>
      {transactions.map((txnId) => (
        <TransactionToast
          key={txnId}
          txnId={txnId}
          explorerUrl={chain?.blockExplorers?.default?.url}
        />
      ))}
    </>
  )
}
