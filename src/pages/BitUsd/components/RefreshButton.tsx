import { useParams } from 'react-router-dom'

import { RefreshIcon } from '@/assets/icons'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useVaultDetail } from '@/hooks/useVaultDetail'
import { cn } from '@/utils/cn'

export const RefreshButton: React.FC<{ className?: string }> = ({
  className
}) => {
  const { chainId } = useParams()
  const { refetch: refetchCollaterals, isFetching: isFetchingCollaterals } =
    useCollaterals(Number(chainId))
  const { refreshVaultValues, isRefreshingVaultValues } = useVaultDetail()

  const isRefreshing = isRefreshingVaultValues || isFetchingCollaterals

  const refresh = () => {
    refreshVaultValues()
    refetchCollaterals()
  }

  return (
    <button
      disabled={isRefreshing}
      className={cn(
        'h-[15px] w-[15px] flex items-center justify-center cursor-pointer hover:text-[#516DF2] active:text-[#1E3ABF]',
        isRefreshing && 'animate-spin',
        className
      )}
      onClick={refresh}>
      <RefreshIcon />
    </button>
  )
}
