import { Image } from '@/components/Image'
import { LINKS } from '@/config/links'
import { useWindowSize } from '@/hooks/useWindowSize'
import { getIconUrl } from '@/utils/getImageUrl'

export const CopyRightAndLinks: React.FC = () => {
  const { width } = useWindowSize()
  return (
    <div
      className="fixed bottom-[100px] left-0 z-50 flex w-full origin-bottom items-center justify-between px-[136px] text-white mix-blend-difference"
      style={{
        padding: `0 ${(136 / 1920) * width}px`
      }}>
      <div
        className="flex origin-left items-center gap-x-1.5 font-bold"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <span>
          <Image src={getIconUrl('copyright')} />
        </span>
        <span className="cursor-default">bitSmiley team 2024</span>
      </div>
      <div
        className="flex origin-right items-center gap-x-6 font-bold"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <span
          className="cursor-pointer hover:underline active:no-underline"
          onClick={() => window.open(LINKS.whitePaper, '__blank')}>
          [Whitepaper]
        </span>
        <span
          className="cursor-pointer text-green hover:underline active:no-underline"
          onClick={() => window.open(LINKS.twitter, '__blank')}>
          [Twitter]
        </span>
        <span
          className="cursor-pointer text-green hover:underline active:no-underline"
          onClick={() => window.open(LINKS.discord, '__blank')}>
          [Discord]
        </span>
      </div>
    </div>
  )
}
