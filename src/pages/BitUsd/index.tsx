import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { Image } from '@/components/Image'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'
import { FeatureEnabled } from '@/services/user'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

const BitUsd: React.FC = () => {
  const {
    isConnected,
    enabledFeatures,
    isLoading: isLoadingUserInfo
  } = useUserInfo()
  const { isLoading: isLoadingUserMintingPairs } = useUserMintingPairs()

  const isLoading = isLoadingUserInfo || isLoadingUserMintingPairs
  const isBitUsdEnabled = enabledFeatures?.AlphaNet === FeatureEnabled.ENABLED

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
        <div>loading...</div>
      ) : (
        <div className="relative -top-8 left-1/2 aspect-[1960/1273] w-[1280px] -translate-x-1/2 xl:w-[1960px] 3xl:w-full">
          <div className="scrollbar-none absolute left-[24%] top-[24%] z-50 size-full h-[40%] w-[51.2%] overflow-y-auto overflow-x-hidden overscroll-contain">
            <Suspense fallback="...">
              <Outlet />
            </Suspense>
          </div>

          <div className="absolute bottom-[30.1%] left-[62.2%] z-10 font-sdm text-xs text-white xl:left-[63%] xl:text-base">
            Current BTC Price: <span className="text-green">${wbtcPrice}</span>
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
