import { Link, useLocation, useNavigate } from 'react-router-dom'

import { HeaderIcon, RightAngleThin } from '@/assets/icons'
import { cn } from '@/utils/cn'

import { Airdrop } from './Airdrop'
import { ConnectWallet } from './ConnectWallet'

export const Header: React.FC<{ wallet?: boolean; isAirdrop?: boolean }> = ({
  wallet,
  isAirdrop
}) => {
  return (
    <div className="absolute left-0 top-[50px] z-50 flex w-full  items-center justify-between px-12 text-white sm:justify-center">
      <Link to="/" className={cn({ 'sm:hidden': isAirdrop })}>
        <HeaderIcon />
      </Link>

      {!!wallet && (
        <div className="flex items-center gap-x-9 sm:hidden">
          <div className="relative">
            <ConnectWallet />
            <EnterAppButton />
            <Airdrop />
          </div>
        </div>
      )}
    </div>
  )
}

const EnterAppButton: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isMainApp = location.pathname.startsWith('/app')

  return (
    <div
      className="group absolute top-[calc(100%+12px)] size-full cursor-pointer"
      onClick={() => {
        if (!isMainApp) {
          navigate('/app')
        } else {
          navigate('/')
        }
      }}>
      <div
        className={cn(
          'relative flex size-full items-center justify-center whitespace-nowrap bg-green/10 uppercase text-green group-hover:bg-green/30 group-hover:font-bold group-hover:text-opacity-70 group-active:bg-green/10',
          isMainApp &&
            'text-white bg-black/30 group-hover:bg-black/50 mix-blend-difference'
        )}>
        <span>{isMainApp ? 'Home' : 'Enter APP'}</span>
        <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
        <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
      </div>
    </div>
  )
}
