import { getAssetUrl } from '@/utils/getAssetsUrl'

export const RollingDice: React.FC = () => {
  return (
    <div className="absolute left-0 top-0 h-full w-full">
      <video
        loop
        autoPlay
        className="mix-blend-screen"
        src={getAssetUrl('/src/assets/rolling-dice.mp4')}
      />
    </div>
  )
}
