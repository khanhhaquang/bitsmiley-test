import React, { Suspense, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Image } from '@/components/Image'
import { OnChainLoader } from '@/components/OnchainLoader'
import { NotConnected } from '@/components/StakingMachine/BoxContent/NotConnected'
import { Input, InputProps } from '@/components/ui/input'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserPoint } from '@/hooks/useUserPoint'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

const JoinTeamButton: React.FC<{
  text: string
  className?: string
  disabled?: boolean
  onClick?: () => void
}> = ({ text, onClick, disabled, className }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center text-center justify-center h-[32px] bg-white/10 px-4 font-ibmb text-sm font-sm text-white/70',
        'border border-white/50 shadow-[0px_0px_5px_1px_rgba(255,255,255,0.12)] cursor-pointer',
        !disabled && 'hover:font-bold hover:bg-white/40 active:bg-white/70',
        disabled && 'bg-white/50 text-white/20 cursor-not-allowed',
        className
      )}>
      {text}
    </button>
  )
}

const InputWithButton: React.FC<InputProps> = (props) => {
  const [value, setValue] = useState('')
  const [isInvalidCode, setIsInvalidCode] = useState(false)

  const { joinTeam, isJoiningTeam } = useUserPoint()

  const handleSubmit = async () => {
    const result = await joinTeam(value)
    if (result.code !== 0) {
      setIsInvalidCode(true)
    }
  }

  return (
    <div>
      <div className="flex h-[30px] items-center">
        <Input
          {...props}
          className="h-full min-w-[150px] border-r-0"
          value={value}
          onChange={(e) => {
            setIsInvalidCode(false)
            setValue(e.target.value.trim())
          }}
        />
        <JoinTeamButton
          className="h-full w-[100px] shrink-0 px-0"
          text={isJoiningTeam ? 'Joining...' : 'Confirm'}
          disabled={!value}
          onClick={handleSubmit}
        />
      </div>
      {isInvalidCode && !isJoiningTeam && (
        <p className="mt-2 text-center font-ibmr text-sm text-error">
          Invalid invitation code
        </p>
      )}
    </div>
  )
}

const Invitation: React.FC = () => {
  const { createTeam, isCreatingTeam } = useUserPoint()
  return (
    <div className="z-10 flex size-full items-center justify-center text-white">
      <div className="relative w-[388px] border border-white/20 p-[1px]">
        <Image
          className="absolute left-[-394px] top-1/2 -translate-y-1/2"
          src={getIllustrationUrl('join-team-left-dashes')}
          height={20}
          width={400}
        />
        <Image
          className="absolute right-[-394px] top-1/2 -translate-y-1/2"
          src={getIllustrationUrl('join-team-right-dashes')}
          height={20}
          width={400}
        />
        <div className="border border-white/20 p-[0.5px]">
          <div className="relative overflow-hidden border-white/20 bg-black/30 p-[42px]">
            <div className="relative z-10 flex flex-col items-center justify-center">
              <h2 className="font-ibmb text-2xl uppercase">Join a team?</h2>
              <h3 className="mb-3 mt-6 max-w-[330px] text-center font-ibmr text-sm">
                Team invitation code:
              </h3>
              <InputWithButton />
              <span className="my-3 font-ibmr text-sm">or</span>
              <JoinTeamButton
                text={isCreatingTeam ? 'Creating...' : 'Be my own captain'}
                onClick={createTeam}
              />
            </div>

            <Image
              src={getIllustrationUrl('join-team-bg', 'webp')}
              width={348}
              height={348}
              className="absolute -right-14 bottom-[-80px] z-0 rotate-[-26deg] opacity-30 mix-blend-screen"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const MainBitPoint: React.FC = () => {
  const { isConnected } = useUserInfo()
  const { isJoined, isLoading: isLoadingUserPoint } = useUserPoint()

  if (!isConnected) return <NotConnected />
  if (isLoadingUserPoint) return <OnChainLoader />
  if (!isJoined) return <Invitation />

  return (
    <Suspense fallback="...">
      <Outlet />
    </Suspense>
  )
}

export default MainBitPoint
