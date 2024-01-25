import { PlayerInfo } from './Common'

export const DisableMinting: React.FC = () => {
  return (
    <>
      <PlayerInfo />

      <div className="absolute left-[668px] top-[431px] font-smb text-sm">
        ohhh...
      </div>

      <div className="absolute left-[468px] top-[467px] w-[456px] text-center text-sm">
        Something went wrong during the minting process.
      </div>
    </>
  )
}
