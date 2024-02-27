import { useChainId, useChains } from 'wagmi'
import { getTransactions } from '@/store/common/reducer'
import { useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { useStoreActions } from '@/hooks/useStoreActions'
import { openUrl } from '@/utils/getAssetsUrl'
import { Hash } from 'viem'
import { CloseIcon, SuccessIcon } from '@/assets/icons'
import { useWaitForTransactionReceipt } from 'wagmi'

type TransactionToastProps = {
  txnId: Hash
  explorerUrl?: string
}
const TransactionToast: React.FC<TransactionToastProps> = ({
  txnId,
  explorerUrl
}) => {
  const { removeTransaction } = useStoreActions()
  const { status } = useWaitForTransactionReceipt({ hash: txnId })

  useEffect(() => {
    let closeTimeout: NodeJS.Timeout
    if (status !== 'pending') {
      closeTimeout = setTimeout(() => removeTransaction(txnId), 5000)
    }

    ;() => {
      clearTimeout(closeTimeout)
    }
  }, [removeTransaction, status, txnId])

  return (
    <div
      key={txnId}
      className="flex animate-[slide_0.3s_ease-in-out] items-center justify-center gap-x-2 border border-white/50 bg-black p-3 text-sm text-white">
      {status === 'pending' && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      )}
      {status === 'success' && <SuccessIcon />}

      <span>
        {status === 'success' && 'Your transaction succeeded.'}
        {status === 'pending' && 'Transaction processing on-chain...'}
        {status === 'error' && 'Your transaction has failed.'}
        <span className="text-green">
          [
          <span
            className="cursor-pointer hover:underline"
            onClick={() => openUrl(`${explorerUrl}/tx/${txnId}`)}>
            Check
          </span>
          ]
        </span>
      </span>
      <CloseIcon
        className="h-[14px] w-[14px] cursor-pointer"
        onClick={() => removeTransaction(txnId)}
      />
    </div>
  )
}

export const TransactionToasts: React.FC = () => {
  const transactions = useSelector(getTransactions)
  const chains = useChains()
  const chainId = useChainId()
  const chain = useMemo(
    () => chains.find((c) => c.id === chainId),
    [chainId, chains]
  )

  if (!chain?.blockExplorers?.default?.url) return null

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
