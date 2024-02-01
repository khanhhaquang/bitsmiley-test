import { DearBitSmiler } from './Common'

export const NotConnected: React.FC = () => {
  return (
    <>
      <DearBitSmiler />

      <div className="absolute left-1/2 top-[444px] -translate-x-1/2 text-sm">
        Grand minting is coming. Connect your wallet to find more!
      </div>
    </>
  )
}
