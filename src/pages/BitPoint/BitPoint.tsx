import { useUserPoint } from '@/hooks/useUserPoint'

import { BitPointTitle } from './components/BitPointTitle'
import { CaptionInvitationCode } from './components/InvitationCode'
import { ScoreBoard } from './components/Scoreboard'
import { YourPoint } from './components/YourPoint'
import { YourTeam } from './components/YourTeam'

const BitPoint: React.FC = () => {
  const { isCaptain } = useUserPoint()

  return (
    <div className="flex size-full flex-col items-center overflow-x-hidden py-10">
      {isCaptain ? (
        <>
          <BitPointTitle title="Hello captain" className="mb-8" />
          <CaptionInvitationCode />
          <div className="flex items-start gap-x-6">
            <div className="flex flex-col gap-y-5">
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
            <div className="flex flex-col gap-y-4">
              <YourTeam />
              <YourPoint />
            </div>
            <ScoreBoard />
          </div>
        </>
      )}
    </div>
  )
}

export default BitPoint
