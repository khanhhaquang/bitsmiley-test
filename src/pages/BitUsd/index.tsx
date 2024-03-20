import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { Image } from '@/components/Image'
import { OnChainLoader } from '@/components/OnchainLoader'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { FeatureEnabled } from '@/services/user'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

const BitUsd: React.FC = () => {
  const { isConnected, enabledFeatures, isLoading } = useUserInfo()
  const isBitUsdEnabled =
    !!enabledFeatures && enabledFeatures?.AlphaNet === FeatureEnabled.ENABLED

  const wbtcPrice = useTokenPrice()

  if (
    (!isLoading && !isConnected) ||
    (!isLoading && isConnected && !isBitUsdEnabled)
  ) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-bitUsdBg bg-cover bg-center bg-no-repeat text-white">
      {isLoading ? (
        <OnChainLoader />
      ) : (
        <div className="relative -top-8 left-1/2 aspect-[1960/1273] w-[1280px] -translate-x-1/2 xl:w-[1960px] 3xl:w-full">
          <div className="scrollbar-none absolute left-[24%] top-[24%] z-50 size-full h-[40%] w-[51.2%] overflow-y-auto overflow-x-hidden overscroll-contain">
            <Suspense fallback="...">
              <Outlet />
            </Suspense>
          </div>

          <div className="absolute bottom-[29.5%] right-[24.7%] z-10 flex h-[3%] w-[14%] items-center justify-center gap-x-1 text-nowrap font-sdm text-[10px] text-white xl:text-base">
            Current BTC Price:
            <span className={cn(wbtcPrice && 'text-green')}>
              {wbtcPrice ? `$${formatNumberWithSeparator(wbtcPrice, 4)}` : '-'}
            </span>
          </div>

          <Image
            className="absolute left-0 top-0 size-full"
            src={getIllustrationUrl('bitusd-machine', 'webp')}
          />
        </div>
      )}
    </div>
  )
}

export default BitUsd
