import { SetStateAction, Dispatch } from 'react'
import { InscriptionCheckerTitle, PlayerInfo } from './Common'
import { CloseSolidIcon } from '@/assets/icons'
import { useCheckInsctiption } from '@/hooks/useCheckInscription'

export const InscriptionChecker: React.FC<{
  inscriptionId: string
  setInscriptionId: Dispatch<SetStateAction<string>>
}> = ({ inscriptionId, setInscriptionId }) => {
  const { isChecking } = useCheckInsctiption(inscriptionId)

  return (
    <>
      <InscriptionCheckerTitle />
      <PlayerInfo />

      {isChecking ? (
        <div className="absolute left-1/2 top-[444px] z-[100] -translate-x-1/2 text-sm">
          Checking inscription on-chain...
        </div>
      ) : (
        <>
          <div className="absolute bottom-[547px] left-1/2 w-[479px] -translate-x-1/2 text-center text-sm text-green">
            Input on-chain ID to check the validity of bitDisc-Black, then
            pressed the CHECK button
          </div>

          <div className="absolute bottom-[497px] left-1/2 flex w-[400px] -translate-x-1/2 items-center justify-center gap-x-1.5 border border-green bg-grey4/30 p-1.5 ">
            <input
              placeholder="Paste ID here"
              className="flex-1 bg-transparent text-sm placeholder:text-center focus:outline-none"
              value={inscriptionId}
              onChange={(e) => setInscriptionId(e.target.value)}
            />
            {!!inscriptionId && (
              <CloseSolidIcon
                className="cursor-pointer"
                onClick={() => setInscriptionId('')}
              />
            )}
          </div>

          <div className="absolute bottom-[414px] left-1/2 w-[479px] -translate-x-1/2 text-center text-sm ">
            You can also connect wallet to check your minting history
          </div>
        </>
      )}
    </>
  )
}
