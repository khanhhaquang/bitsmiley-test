import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AirdropIcon, HeaderIcon, RightAngleThin } from '@/assets/icons'
import { useAirdropAddresses } from '@/hooks/useAirdropAddresses'
import { cn } from '@/utils/cn'

import { ConnectWallet } from './ConnectWallet'

export const Header: React.FC<{ wallet?: boolean }> = ({ wallet }) => {
  return (
    <div className="absolute left-0 top-[50px] z-50 flex w-full items-center justify-between px-12 text-white">
      <Link to="/">
        <HeaderIcon />
      </Link>

      {!!wallet && (
        <div className="flex items-center gap-x-9">
          <div className="relative">
            <ConnectWallet />
            <EnterAppButton />
            <AirdropButton />
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

const AirdropButton: React.FC = () => {
  const airdropAddresses = useAirdropAddresses()

  if (!airdropAddresses?.length) return null

  return (
    <div className="group absolute top-[calc(200%+24px)] size-full cursor-pointer">
      <div
        className={cn(
          'relative flex size-full items-center justify-center whitespace-nowrap bg-yellow4/25 uppercase text-yellow5 group-hover:bg-yellow4/50 group-active:text-opacity-50 group-active:bg-yellow4/10'
        )}>
        <span className="flex items-center justify-center gap-x-1">
          <AirdropIcon />
          AIRDROP
        </span>
        <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
        <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
      </div>
    </div>
  )
}
