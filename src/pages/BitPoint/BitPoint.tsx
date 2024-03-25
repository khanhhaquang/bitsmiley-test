import { OnChainLoader } from '@/components/OnchainLoader'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserPoint } from '@/hooks/useUserPoint'

import { BitPointTitle } from './components/BitPointTitle'
import { CaptionInvitationCode } from './components/InvitationCode'
import { ScoreBoard } from './components/Scoreboard'
import { YourPoint } from './components/YourPoint'
import { YourTeam } from './components/YourTeam'

const BitPoint: React.FC = () => {
  const { enabledFeatures } = useUserInfo()
  const { isCaptain, isLoading } = useUserPoint()

  if (!enabledFeatures?.BitPoint)
    return (
      <div className="flex size-full items-center justify-center text-2xl text-error">
        Not available
      </div>
    )

  if (isLoading) return <OnChainLoader />

  return (
    <div className="flex size-full flex-col items-center overflow-x-hidden py-10">
      {isCaptain ? (
        <>
          <BitPointTitle title="Hello captain" className="mb-4" />
          <CaptionInvitationCode />
          <div className="flex items-start gap-x-6">
            <div className="flex flex-col gap-y-6">
              <YourTeam />
              <YourPoint />
            </div>
            <ScoreBoard />
          </div>
        </>
      ) : (
        <>
          <BitPointTitle title="Earn bitPoint" />
          <div className="flex items-start gap-x-6">
            <div className="flex flex-col gap-y-6">
              <YourPoint />
              <YourTeam />
            </div>
            <ScoreBoard />
          </div>
        </>
      )}
    </div>
  )
}

export default BitPoint
