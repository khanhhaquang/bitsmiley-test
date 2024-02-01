import { PlayerInfo } from './Common'

export const CheckingInscription: React.FC = () => {
  return (
    <>
      <PlayerInfo />
      <div className="absolute left-1/2 top-[444px] z-[100] -translate-x-1/2 text-sm">
        Checking inscriptions on-chain...
      </div>
    </>
  )
}
