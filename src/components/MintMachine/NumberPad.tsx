import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const NumberPad: React.FC = () => {
  return (
    <div className="absolute left-[515px] top-[648px] z-10 h-[69px] w-[133px]">
      <Image src={getIllustrationUrl('numberpad-default')} />
    </div>
  )
}
