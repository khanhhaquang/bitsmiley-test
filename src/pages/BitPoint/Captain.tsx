import { CaptainScoreboard } from './components/CaptainScoreboard'
import { ScoreBoard } from './components/Scoreboard'
import YourPoint from './components/YourPoint'

const Captain: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-4">
      <YourPoint />
      <ScoreBoard />
      <CaptainScoreboard />
    </div>
  )
}

export default Captain
