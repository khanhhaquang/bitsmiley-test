import { Suspense, useMemo, useState } from 'react'
import { matchPath, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { TVLIndicatorIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { OnChainLoader } from '@/components/OnchainLoader'
import { useSuiTVL } from '@/hooks/useSuiTVL'
import { useTokenPrice } from '@/hooks/useTokenPrice'
import { useTVL } from '@/hooks/useTVL'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

const MachineContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { enabledFeatures } = useUserInfo()
  const bitUsdPathPatterns = [
    '/app/alphanet',
    '/app/alphanet/vault/:chainId/:collateralId'
  ]
  const bitPointPathPattern = ['/app/bit-point', '/app/bit-point/history']

  return (
    <div className="relative -top-8 left-1/2 aspect-[1960/1273] w-[1280px] -translate-x-1/2 xl:w-[1960px] 3xl:w-full">
      {children}

      <NavigationButton
        title="AlphaNet"
        path="/app/alphanet"
        pathPatterns={bitUsdPathPatterns}
        disabled={!enabledFeatures?.AlphaNet}
      />
      <NavigationButton
        title="BITPOINT"
        path="/app/bit-point"
        className="top-[31.7%]"
        disabled={!enabledFeatures?.BitPoint}
        pathPatterns={bitPointPathPattern}
      />
      <NavigationButton className="top-[38.2%]" />
      <NavigationButton className="top-[44.6%]" />

      <TVLIndicator />

      <Image
        className="absolute left-[49.36%] top-[17.3%] z-50 w-[1.4%]"
        src={getIllustrationUrl('bitsmiley-logo')}
      />

      <Image
        className="absolute left-0 top-0 size-full"
        src={getIllustrationUrl('bitusd-machine', 'webp')}
      />
    </div>
  )
}

const ContentContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div
      id="machine-content-container"
      className="scrollbar-none absolute left-[24%] top-[24%] z-50 size-full h-[40%] w-[51.2%] overflow-y-auto overflow-x-hidden overscroll-contain">
      {children}
    </div>
  )
}

const TVLIndicator: React.FC = () => {
  const { isSuiConnected } = useUserInfo()
  const { formattedTVL } = useTVL()
  const { suiFormattedTVL } = useSuiTVL()

  return (
    <div className="absolute left-[33%] top-[8.4%] z-50 h-[4.3%] w-[33.4%] overflow-hidden">
      <div className="flex size-full items-center justify-between">
        <Image
          className="h-full opacity-50"
          src={getIllustrationUrl('bitusd-machine-header-left', 'webp')}
        />
        <div className="flex items-center justify-center gap-x-1 xl:gap-x-3">
          <TVLIndicatorIcon className="h-4 xl:h-6" />
          <span className="text-nowrap stroke-green6 stroke-[0.2] font-sdm text-2xl text-green6 xl:text-[28px]">
            TVL: {isSuiConnected ? suiFormattedTVL : formattedTVL}
          </span>
          <TVLIndicatorIcon className="h-4 rotate-180 xl:h-6" />
        </div>
        <Image
          className="h-full opacity-50"
          src={getIllustrationUrl('bitusd-machine-header-right', 'webp')}
        />
      </div>
    </div>
  )
}

const BTCPrice = () => {
  const wbtcPrice = useTokenPrice()

  return (
    <div className="absolute bottom-[29.75%] right-[24.92%] z-10 flex h-[3%] w-[14%] items-center justify-center gap-x-1 text-nowrap font-sdm text-[10px] text-white xl:text-base">
      Current BTC Price:
      <span className={cn(wbtcPrice && 'text-green')}>
        {wbtcPrice ? `$${formatNumberWithSeparator(wbtcPrice, 4)}` : '-'}
      </span>
    </div>
  )
}

const NavigationButton: React.FC<{
  path?: string
  title?: string
  disabled?: boolean
  className?: string
  pathPatterns?: string[]
}> = ({ className, disabled, title, path, pathPatterns }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive =
    !!path && pathPatterns?.some((p) => !!matchPath(p, location.pathname))

  const [isHover, setIsHover] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const isDisabled = !path || !!disabled

  const imageUrl = useMemo(() => {
    if (isDisabled) return 'bitusd-button-normal'

    if (isActive) return 'bitusd-button-active'
    if (isPressed) return 'bitusd-button-pressed'
    if (isHover) return 'bitusd-button-hover'
    return 'bitusd-button-normal'
  }, [isActive, isDisabled, isHover, isPressed])

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={() => !isDisabled && !isActive && navigate(path)}
      className={cn(
        'absolute right-[18.42%] top-[25%] z-10 flex w-[4.6%] flex-col items-start gap-y-0.5 xl:gap-y-1',
        !isDisabled && !isActive ? 'cursor-pointer' : 'cursor-default',
        className
      )}>
      <span
        className={cn(
          'min-h-[9.75px] xl:min-h-[15px] text-[6.5px] font-smb xl:text-[10px] text-black/50 [text-shadow:1.5px_0_0_#A5A5A5]',
          !isDisabled && (isActive || isHover || isPressed) && 'text-blue'
        )}>
        {title}
      </span>
      <Image src={getIllustrationUrl(imageUrl, 'webp')} />
    </button>
  )
}

const MainApp = () => {
  const { isConnected, isLoading } = useUserInfo()
  const { pathname } = useLocation()
  const isAlphanet = pathname === '/app/alphanet'

  const renderContent = () => {
    if (!isConnected && !isAlphanet) {
      return (
        <div className="flex size-full items-center justify-center text-2xl">
          Connect wallet first
        </div>
      )
    }

    return isLoading && !isAlphanet ? <OnChainLoader /> : <Outlet />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-bitUsdBg bg-cover bg-center bg-no-repeat text-white">
      <MachineContainer>
        <ContentContainer>
          <Suspense fallback="...">{renderContent()}</Suspense>
        </ContentContainer>
        <BTCPrice />
      </MachineContainer>
    </div>
  )
}

export default MainApp
