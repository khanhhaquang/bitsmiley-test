import { RefreshIcon } from '@/assets/icons'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useTokenAllowance } from '@/hooks/useTokenAllowance'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useUserVault } from '@/hooks/useUserVault'
import { cn } from '@/utils/cn'

export const RefreshButton: React.FC = () => {
  const contractAddresses = useContractAddresses()
  const {
    refetchVault,
    isFetching: isFetchingVault,
    refetchMaxVault,
    isFetchingMaxVault,
    refetchChangedVault,
    isFetchingChangedVault,
    refetchVaultAddress,
    isFetchingVaultAddress
  } = useUserVault()

  const {
    refetchAllowance: refetchWbtcAllowance,
    isFetching: isFetchingWbtcAllowance
  } = useTokenAllowance(contractAddresses?.WBTC, contractAddresses?.BitSmiley)
  const {
    refetchAllowance: refetchBitUsdAllowance,
    isFetching: isFetchingBitUsdAllowance
  } = useTokenAllowance(
    contractAddresses?.BitUSDL2,
    contractAddresses?.BitSmiley
  )

  const {
    refetchBalance: refetchWbtcBalance,
    isFetching: isFetchingWbtcBalance
  } = useTokenBalance(contractAddresses?.WBTC)
  const {
    refetchBalance: refetchBitUsdBalance,
    isFetching: isFetchingBitUsdBalance
  } = useTokenBalance(contractAddresses?.BitUSDL2)

  const isRefreshing =
    isFetchingVaultAddress ||
    isFetchingVault ||
    isFetchingMaxVault ||
    isFetchingChangedVault ||
    isFetchingBitUsdBalance ||
    isFetchingWbtcBalance ||
    isFetchingWbtcAllowance ||
    isFetchingBitUsdAllowance

  const refresh = () => {
    refetchVaultAddress()
    refetchVault()
    refetchMaxVault()
    refetchChangedVault()
    refetchWbtcAllowance()
    refetchWbtcBalance()
    refetchBitUsdAllowance()
    refetchBitUsdBalance()
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
