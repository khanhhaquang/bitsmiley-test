import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const MobileNotSupported: React.FC = () => {
  return (
    <div className="mt-24 flex scale-[2] flex-col items-center justify-center gap-y-4">
      <Image
        src={getIllustrationUrl('mobile-disc-coins', 'webp')}
        width={150}
        height={87}
      />
      <p className="text-xs">--Visit on desktop for full experience--</p>
    </div>
  )
}
