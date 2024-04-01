import { RefreshIcon } from '@/assets/icons'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useUserVault } from '@/hooks/useUserVault'
import { cn } from '@/utils/cn'

export const RefreshButton: React.FC<{ className?: string }> = ({
  className
}) => {
  const { refetch: refetchCollaterals, isFetching: isFetchingCollaterals } =
    useCollaterals()
  const { refreshVaultValues, isRefreshingVaultValues } = useUserVault()

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
