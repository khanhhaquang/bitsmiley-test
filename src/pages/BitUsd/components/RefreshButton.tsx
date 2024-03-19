import { RefreshIcon } from '@/assets/icons'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { useUserVault } from '@/hooks/useUserVault'
import { cn } from '@/utils/cn'

export const RefreshButton: React.FC = () => {
  const { refetch: refetchMintingPairs, isFetching: isFetchingMintingPairs } =
    useUserMintingPairs()
  const { refreshVaultValues, isRefreshingVaultValues } = useUserVault()

  const isRefreshing = isRefreshingVaultValues || isFetchingMintingPairs

  const refresh = () => {
    refreshVaultValues()
    refetchMintingPairs()
  }

  return (
    <button
      disabled={isRefreshing}
      className={cn(
        'h-[15px] w-[15px] flex items-center justify-center cursor-pointer hover:text-[#516DF2] active:text-[#1E3ABF]',
        isRefreshing && 'animate-spin'
      )}
      onClick={refresh}>
      <RefreshIcon />
    </button>
  )
}
