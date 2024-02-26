import { useChainId, useChains } from 'wagmi'
import { getTransactions } from '@/store/common/reducer'
import { openUrl } from '@/utils/getAssetsUrl'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { CloseIcon, SpinIcon } from '@/assets/icons'
import { useStoreActions } from '@/hooks/useStoreActions'

export const TransactionToasts: React.FC = () => {
  const transactions = useSelector(getTransactions)
  const { removeTransaction } = useStoreActions()

  const chains = useChains()
  const chainId = useChainId()
  const chain = useMemo(
    () => chains.find((c) => c.id === chainId),
    [chainId, chains]
  )

  if (!chain?.blockExplorers?.default?.url) return null

  return (
    <>
      {transactions.map((txid) => (
        <div
          key={txid}
          className="flex animate-[slide_0.3s_ease-in-out] items-center justify-center gap-x-2 border border-white/50 bg-black p-3 text-sm text-white">
          <SpinIcon />
          <span>
            Transaction processing on-chain...
            <span className="text-green">
              [
              <span
                className="cursor-pointer hover:underline"
                onClick={() =>
                  openUrl(`${chain.blockExplorers?.default.url}/tx/${txid}`)
                }>
                Check
              </span>
              ]
            </span>
          </span>
          <CloseIcon
            className="h-[14px] w-[14px] cursor-pointer"
            onClick={() => removeTransaction(txid)}
          />
        </div>
      ))}
    </>
  )
}
