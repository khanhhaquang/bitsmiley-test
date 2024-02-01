import { PlayerInfo } from './Common'

export const DisableMinting: React.FC = () => {
  return (
    <>
      <PlayerInfo />

      <div className="absolute left-1/2 top-[431px] -translate-x-1/2 font-smb text-sm">
        ohhh...
      </div>

      <div className="absolute left-1/2 top-[467px] w-[456px] -translate-x-1/2 text-center text-sm">
        Something went wrong during the minting process.
      </div>
    </>
  )
}
