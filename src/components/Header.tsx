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
            'text-white bg-white/10 group-hover:bg-white/30 mix-blend-difference'
        )}>
        <span>{!isHome ? 'Home' : 'Enter APP'}</span>
        <RightAngleThin className="absolute left-0 top-0" />
        <RightAngleThin className="absolute right-0 top-0 rotate-90" />
        <RightAngleThin className="absolute bottom-0 right-0 rotate-180" />
        <RightAngleThin className="absolute bottom-0 left-0 -rotate-90" />
      </div>
    </div>
  )
}
