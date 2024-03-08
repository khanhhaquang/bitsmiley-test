import { useState } from 'react'
import { cn } from '@/utils/cn'
import { Input, InputProps } from '@/components/ui/input'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserPoint } from '@/hooks/useUserPoint'
import { CaptainScoreboard } from './components/CaptainScoreboard'
import { YourPoint } from './components/YourPoint'
import { ScoreBoard } from './components/Scoreboard'
import { YourTeam } from './components/YourTeam'

const BitPoint: React.FC = () => {
  const { isConnected } = useUserInfo()
  const { isJoined, isCaptain, isLoading: isLoadingUserPoint } = useUserPoint()

  if (!isConnected) return <NotConnected />
  if (isLoadingUserPoint) return <Loading />
  if (!isJoined) return <Invitation />

  return (
    <div className="flex h-screen w-screen items-start justify-center gap-x-7 overflow-x-hidden py-[180px]">
      {isCaptain ? (
        <>
          <CaptainScoreboard />
          <div className="flex flex-col gap-y-4">
            <YourPoint />
            <ScoreBoard />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-y-4">
            <YourPoint />
            <YourTeam />
          </div>
          <ScoreBoard />
        </>
      )}
    </div>
  )
}

const Loading: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-white">
      loading...
    </div>
  )
}

const Invitation: React.FC = () => {
  const { createTeam, isCreatingTeam } = useUserPoint()
  return (
    <div className="flex h-screen w-screen items-center justify-center border-white text-white">
      <div className="flex flex-col items-center justify-center border border-white/50 bg-black bg-connect-modal bg-cover bg-no-repeat p-[42px]">
        <div className="font-ppnb text-5xl">Join a team?</div>
        <div className="mb-3 mt-12 max-w-[330px] text-center font-ibmr text-sm">
          Input invitation code:
        </div>
        <InputWithButton />
        <div className="my-6 font-ibmr text-sm">or</div>
        <JoinTeamButton
          text={isCreatingTeam ? 'Creating...' : 'Be my own captain'}
          onClick={createTeam}
        />
      </div>
    </div>
  )
}

const JoinTeamButton: React.FC<{
  text: string
  className?: string
  disabled?: boolean
  onClick?: () => void
}> = ({ text, onClick, disabled, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'block h-8 bg-white px-5 font-ibmr text-sm font-medium text-black',
        !disabled && 'hover:cursor-pointer hover:font-bold active:bg-grey7',
        disabled && 'bg-white/70 text-white/50 cursor-default',
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

  return (
    <div>
      <div className="flex items-center">
        <Input
          {...props}
          className="min-w-[243px] border-r-0"
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
        />
        <JoinTeamButton
          className="flex w-[100px] shrink-0 items-center justify-center px-0"
          text={isJoiningTeam ? 'Joinning...' : 'Confirm'}
          disabled={!value}
          onClick={async () => {
            const result = await joinTeam(value)
            if (result.code !== 0) {
              setIsInvalidCode(true)
            }
          }}
        />
      </div>
      {isInvalidCode && !isJoiningTeam && (
        <div className="mt-2 text-center text-warning">
          Invalid invitation code
        </div>
      )}
    </div>
  )
}

const NotConnected: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center border-white text-white">
      <div className="flex flex-col items-center justify-center gap-y-12 border border-white/50 bg-black bg-connect-modal bg-cover bg-no-repeat p-[42px]">
        <div className="font-ppnb text-5xl">Connect wallet first</div>
        <div className="max-w-[330px] text-center font-ibmr text-sm">
          To earn bitPoint, connect your wallet to conitnue.
        </div>
      </div>
    </div>
  )
}

export default BitPoint
