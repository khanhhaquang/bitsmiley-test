import { useUserPoint } from '@/hooks/useUserPoint'

import { CaptainScoreboard } from './components/CaptainScoreboard'
import { ScoreBoard } from './components/Scoreboard'
import { YourPoint } from './components/YourPoint'
import { YourTeam } from './components/YourTeam'

const BitPoint: React.FC = () => {
  const { isCaptain } = useUserPoint()

  return (
    <div className="flex size-full items-start justify-center gap-x-7 overflow-x-hidden py-[180px]">
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

export default BitPoint
