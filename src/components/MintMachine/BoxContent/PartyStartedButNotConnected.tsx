import { AsteriskIcon } from '@/assets/icons'

export const PartyStartedButNotConnected: React.FC = () => {
  return (
    <>
      <div className="absolute left-[485px] top-[321px] flex items-center gap-x-[5px]">
        <AsteriskIcon />
        <span className="font-smb text-sm">------ Dear BitSmiler ------</span>
        <AsteriskIcon />
      </div>

      <div className="absolute left-[453px] top-[444px] text-sm">
        Grand minting is coming. Connect your wallet to find more!
      </div>
    </>
  )
}
