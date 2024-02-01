import { Image } from '@/components/Image'
import { HeaderIcon } from '@/assets/icons'
import { getIllustrationUrl, openUrl } from '@/utils/getAssetsUrl'
import { MEDIA } from '@/config/links'

export const MobilePage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-black">
      <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-mobile bg-cover bg-no-repeat">
        <HeaderIcon className="fixed left-1/2 top-14 z-10 -translate-x-1/2" />
        <div className="z-10 flex flex-col items-center justify-center gap-y-12 px-20">
          <Image src={getIllustrationUrl('mobile-indicator')} />
          <div className="text-center text-sm uppercase text-green">
            Please use desktop browser to access the website
          </div>
        </div>
        <div className="fixed bottom-14 left-1/2 z-10 flex w-full -translate-x-1/2 items-center justify-between px-10 text-white">
          <div
            className="cursor-pointer"
            onClick={() => openUrl(MEDIA.discord)}>
            [
            <span className="hover:underline active:no-underline">Discord</span>
            ]
          </div>
          <div
            className="cursor-pointer"
            onClick={() => openUrl(MEDIA.twitter)}>
            [
            <span className="hover:underline active:no-underline">Twitter</span>
            ]
          </div>
          <div
            className="cursor-pointer"
            onClick={() => openUrl(MEDIA.whitePaper)}>
            [
            <span className="hover:underline active:no-underline">
              Whitepaper
            </span>
            ]
          </div>
        </div>
      </div>
    </div>
  )
}
