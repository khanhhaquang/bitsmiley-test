import { Link, useLocation, useNavigate } from 'react-router-dom'

import { HeaderIcon, RightAngleThin } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { FeatureEnabled } from '@/services/user'
import { cn } from '@/utils/cn'

import { ConnectWallet } from './ConnectWallet'

export const Header: React.FC<{ wallet?: boolean }> = ({ wallet }) => {
  return (
    <div className="absolute left-0 top-[50px] z-50 flex w-full items-center justify-between px-12 text-white md:px-[120px]">
      <Link to="/">
        <HeaderIcon />
      </Link>

      {!!wallet && (
        <div className="flex items-center gap-x-9">
          <div className="relative">
            <ConnectWallet />
            <EnterAppButton />
          </div>
        </div>
      )}
    </div>
  )
}

const EnterAppButton: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { enabledFeatures } = useUserInfo()

  const isHome = location.pathname === '/'
  const isAlphaNetEnabled = enabledFeatures?.AlphaNet === FeatureEnabled.ENABLED

  if (isHome && !isAlphaNetEnabled) return null

  return (
    <div
      className="group absolute top-[calc(100%+27px)] size-full cursor-pointer "
      onClick={() => {
        if (isHome) {
          navigate('/bit-usd')
        } else {
          navigate('/')
        }
      }}>
      <div
        className={cn(
          'relative flex size-full items-center justify-center whitespace-nowrap bg-green/10 uppercase text-green group-hover:bg-green/30 group-hover:font-bold group-hover:text-opacity-70 group-active:bg-green/10',
          !isHome &&
            'text-white bg-black/30 group-hover:bg-black/50 mix-blend-difference'
        )}>
        <span>{!isHome ? 'Home' : 'Enter APP'}</span>
        <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
        <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
      </div>
    </div>
  )
}
