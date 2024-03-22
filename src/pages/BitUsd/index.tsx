import { Suspense, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

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
        <MachineContainer>
          <ContentContainer>
            <Suspense fallback="...">
              <Outlet />
            </Suspense>
          </ContentContainer>
          <BTCPrice />
        </MachineContainer>
      )}
    </div>
  )
}

const BTCPrice: React.FC = () => {
  const wbtcPrice = useTokenPrice()

  return (
    <div className="absolute bottom-[29.5%] right-[24.7%] z-10 flex h-[3%] w-[14%] items-center justify-center gap-x-1 text-nowrap font-sdm text-[10px] text-white xl:text-base">
      Current BTC Price:
      <span className={cn(wbtcPrice && 'text-green')}>
        {wbtcPrice ? `$${formatNumberWithSeparator(wbtcPrice, 4)}` : '-'}
      </span>
    </div>
  )
}

const MachineContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div className="relative -top-8 left-1/2 aspect-[1960/1273] w-[1280px] -translate-x-1/2 xl:w-[1960px] 3xl:w-full">
      {children}

      <NavigationButton title="TESTNET" path="/bit-usd" />
      <NavigationButton
        title="BITPOINT"
        path="/bit-point"
        className="top-[31.7%]"
      />
      <NavigationButton className="top-[38.2%]" />
      <NavigationButton className="top-[44.6%]" />

      <Image
        className="absolute left-0 top-0 size-full"
        src={getIllustrationUrl('bitusd-machine', 'webp')}
      />
    </div>
  )
}

const NavigationButton: React.FC<{
  title?: string
  path?: string
  className?: string
}> = ({ className, title, path }) => {
  const location = useLocation()
  const isActive = !!path && location.pathname.startsWith(path)
  const navigate = useNavigate()

  const [isHover, setIsHover] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const imageUrl = useMemo(() => {
    if (!path) return 'bitusd-button-normal'

    if (isActive) return 'bitusd-button-active'
    if (isPressed) return 'bitusd-button-pressed'
    if (isHover) return 'bitusd-button-hover'
    return 'bitusd-button-normal'
  }, [isActive, isHover, isPressed, path])

  return (
    <button
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={() => path && !isActive && navigate(path)}
      className={cn(
        'absolute right-[18.42%] top-[25%] z-10 flex w-[4.6%] flex-col items-start gap-y-0.5 xl:gap-y-1',
        path && !isActive ? 'cursor-pointer' : 'cursor-default',
        className
      )}>
      <span
        className={cn(
          'min-h-[9.75px] xl:min-h-[15px] text-[6.5px] font-smb xl:text-[10px] text-black/50 [text-shadow:1.5px_0_0_#A5A5A5]',
          (isActive || isHover || isPressed) && 'text-blue'
        )}>
        {title}
      </span>
      <Image src={getIllustrationUrl(imageUrl, 'webp')} />
    </button>
  )
}

const ContentContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div className="scrollbar-none absolute left-[24%] top-[24%] z-50 size-full h-[40%] w-[51.2%] overflow-y-auto overflow-x-hidden overscroll-contain">
      {children}
    </div>
  )
}

export default BitUsd
