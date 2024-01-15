import { LineIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
export const Inscribed: React.FC = () => {
  return (
    <>
      <div className="absolute left-[336px] top-[318px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>39s...sda</div>
      </div>

      <div className="absolute left-[580px] top-[371px] flex flex-col items-center gap-y-6">
        <Image
          src={getIllustrationUrl('black-card')}
          className="h-[130px] w-[205px]"
        />

        <div className="flex flex-col items-center gap-y-1.5">
          <div className="bg-express-black bg-clip-text font-smb text-[11px] text-transparent">
            SMILEY EXPRESS BLACK
          </div>
          <div className="relative h-[14px] w-[88px]">
            <span className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap bg-black px-1.5">
              <span className="bg-express-black bg-clip-text text-[11px] text-transparent">
                bitSmiler OG
              </span>
            </span>
            <LineIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </>
  )
}
