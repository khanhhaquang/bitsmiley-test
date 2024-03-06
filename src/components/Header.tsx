import { cn } from '@/utils/cn'
import { HeaderIcon, RightAngleThin } from '@/assets/icons'
import { ConnectWallet } from './ConnectWallet'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getFeaturesEnabled } from '@/store/common/reducer'
import { FeatureEnabled } from '@/services/project'

export const Header: React.FC<{ wallet?: boolean }> = ({ wallet }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="absolute left-0 top-[50px] z-50 flex w-full items-center justify-between px-[120px] text-white">
      <Link to="/">
        <HeaderIcon />
      </Link>

      {!!wallet && (
        <div className="flex items-center gap-x-9">
          {!isHome && (
            <>
              <LinkItem name="Home" pathname="/" />
              {/* <LinkItem name="bitPoint" pathname="/bit-point" /> */}
              <LinkItem name="AlphaNet" pathname="/bit-usd" />
            </>
          )}
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

  const featuresEnabled = useSelector(getFeaturesEnabled)

  const isEntered = location.pathname.startsWith('/bit-usd')
  const isAlphaNetEnabled = featuresEnabled?.AlphaNet === FeatureEnabled.ENABLED

  if (isEntered || !isAlphaNetEnabled) return null

  return (
    <div
      className="group absolute top-[calc(100%+27px)] h-full w-full cursor-pointer"
      onClick={() => navigate('/bit-usd')}>
      <div className="relative flex h-full w-full items-center justify-center whitespace-nowrap bg-green/10 uppercase text-green group-hover:bg-green/30 group-hover:font-bold group-hover:text-opacity-70 group-active:bg-green/10">
        <span>Enter APP</span>
        <RightAngleThin className="absolute left-0 top-0" />
        <RightAngleThin className="absolute right-0 top-0 rotate-90" />
        <RightAngleThin className="absolute bottom-0 right-0 rotate-180" />
        <RightAngleThin className="absolute bottom-0 left-0 -rotate-90" />
      </div>
    </div>
  )
}

const LinkItem: React.FC<{ name: string; pathname: string }> = ({
  name,
  pathname
}) => {
  const location = useLocation()
  const isToHome = pathname === '/'
  const isActive = !isToHome && location.pathname.startsWith(pathname)

  return (
    <Link className={cn('text-sm', isActive && 'text-blue')} to={pathname}>
      {name}
    </Link>
  )
}
