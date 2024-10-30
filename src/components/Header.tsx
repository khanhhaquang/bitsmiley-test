import { Link, useLocation, useNavigate } from 'react-router-dom'

import { HeaderIcon, RightAngleThin } from '@/assets/icons'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'

import {
  Airdrop as AirdropIntro,
  AirdropButton as EnterAirdropButton
} from './Airdrop'
import { ConnectWallet } from './ConnectWallet'
import { useMemo } from 'react'

export const Header: React.FC<{
  isAirdropPage?: boolean
}> = ({ isAirdropPage }) => {
  const { isMobile } = useMediaQuery()
  const { isConnected } = useUserInfo()
  const { pathname } = useLocation()

  const isRoot = pathname === '/'
  const isMainApp = pathname.startsWith('/app')

  const showAirdropEntryButton = useMemo(() => {
    return pathname !== '/airdrop'
  }, [pathname])

  return (
    <div className="pointer-events-none absolute left-0 top-[50px] z-50 flex w-full items-start justify-between px-12 text-white sm:justify-center">
      <Link
        to="/"
        className={cn('pointer-events-auto', { 'sm:hidden': isAirdropPage })}>
        <HeaderIcon />
      </Link>

      {!isMobile && (
        <div className="pointer-events-auto relative flex flex-col items-center gap-y-3">
          <ConnectWallet />
          {!isRoot && <EnterHomeButton />}
          {!isMainApp && <EnterAppButton />}
          {isConnected && showAirdropEntryButton && <EnterAirdropButton />}
          <AirdropIntro isAirdropPage={isAirdropPage} />
        </div>
      )}
    </div>
  )
}

const EnterAppButton: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="group h-[34px] w-full">
      <button
        onClick={() => {
          navigate('/app')
        }}
        className={cn(
          'relative flex cursor-pointer size-full items-center justify-center whitespace-nowrap bg-green/10 uppercase text-green group-hover:bg-green/30 group-hover:font-bold group-hover:text-opacity-70 group-active:bg-green/10'
        )}>
        <span>Enter APP</span>
        <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
        <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
      </button>
    </div>
  )
}

const EnterHomeButton = () => {
  const navigate = useNavigate()

  return (
    <div className="group h-[34px] w-full">
      <button
        onClick={() => {
          navigate('/')
        }}
        className={cn(
          'relative cursor-pointer flex size-full items-center justify-center whitespace-nowrap uppercase group-hover:font-bold group-hover:text-opacity-70',
          'text-white bg-white/10 group-hover:bg-white/20 group-active:bg-white/30 mix-blend-difference'
        )}>
        <span>Home</span>
        <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
        <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
      </button>
    </div>
  )
}
