import { PlayerInfo } from './Common'

export const CheckingInscription: React.FC = () => {
  return (
    <>
      <PlayerInfo />
      <div className="absolute left-[568px] top-[444px] z-[100] text-sm">
        Checking inscriptions on-chain...
      </div>
    </>
  )
}
