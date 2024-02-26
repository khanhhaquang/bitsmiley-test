import { useUserInfo } from '@/hooks/useUserInfo'
import { TransactionToasts } from './TransactionToasts'

export const ToastsContainer: React.FC = () => {
  const { isConnected } = useUserInfo()

  if (!isConnected) return null

  return (
    <div className="fixed bottom-[109px] left-[136px] z-[1000] flex flex-col items-end gap-y-2">
      <TransactionToasts />
    </div>
  )
}
