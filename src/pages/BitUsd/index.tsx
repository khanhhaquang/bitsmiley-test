import { ReactNode, Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { Image } from '@/components/Image'
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

  if (
    (!isLoading && !isConnected) ||
    (!isLoading && isConnected && !isBitUsdEnabled)
  ) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-bitUsdBg bg-cover bg-center bg-no-repeat text-white">
      {isLoading ? (
        <div>loading...</div>
      ) : (
        <MachineContainer>
          <MachineContent />
        </MachineContainer>
      )}
    </div>
  )
}

const MachineContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative left-1/2 aspect-[1960/1000] w-[1280px] -translate-x-1/2 xl:w-[1960px] 3xl:w-full">
      {children}

      {/* <Image
        className="absolute inset-0 aspect-[1960/1000] w-full"
        src={getIllustrationUrl('bitusd-machine', 'webp')}
      /> */}
    </div>
  )
}

const MachineContent: React.FC = () => {
  return (
    <div className="absolute left-[22%] top-[25%] w-[52%]">
      <div className="relative aspect-[1040/557] w-full overflow-hidden rounded-[62px] bg-bitUsdContentBg">
        <div className="scrollbar-none relative z-50 size-full overflow-y-auto overflow-x-hidden">
          <Suspense fallback="...">
            <Outlet />
          </Suspense>
        </div>

        <Image
          src={getIllustrationUrl('bitusd-content-strips')}
          className="absolute left-0 top-0 z-10 size-full"
        />
        <Image
          src={getIllustrationUrl('bitusd-content-bg')}
          className="absolute left-0 top-0 z-10 size-full mix-blend-multiply"
        />
      </div>
    </div>
  )
}

export default BitUsd
