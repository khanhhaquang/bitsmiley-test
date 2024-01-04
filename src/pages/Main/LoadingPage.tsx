import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { CanvasFrames } from '@/components/CanvasFrames'
import {
  getFrameUrl,
  getIconUrl,
  getIllustrationUrl
} from '@/utils/getImageUrl'
import Typewriter from '@/components/Typewriter'
import { useWindowSize } from '@/hooks/useWindowSize'
import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'

export const LoadingPage: React.FC<{
  onEnter: () => void
  isLoading: boolean
  isPlayingMusic: boolean
  playMusic: () => void
  pauseMusic: () => void
}> = ({ playMusic, pauseMusic, isLoading, isPlayingMusic, onEnter }) => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black bg-loading bg-cover bg-center bg-no-repeat">
      <SmileyLogo />
      <CopyRightAndLinks
        musicControl={false}
        playMusic={playMusic}
        pauseMusic={pauseMusic}
        isPlayingMusic={isPlayingMusic}
      />
      <div className="flex flex-col items-center text-white">
        <div className="mb-12">
          <CanvasFrames
            fps={10}
            width={119}
            height={119}
            imgLocalPaths={Array(13)
              .fill(1)
              .map((_, idx) => getFrameUrl('smiley-rotating', `${idx + 1}`))}
          />
        </div>
        <div className="relative mb-3 flex items-center text-lg">
          LOADING
          <div className="absolute bottom-0 left-full">
            <Typewriter
              loop
              speed={300}
              seq={false}
              cursor={false}
              nodes="..."
            />
          </div>
        </div>
        <div className="mb-12">
          <Image src={getIllustrationUrl('loading-line', 'svg')} />
        </div>

        {!isLoading && (
          <div
            onClick={() => onEnter()}
            className={cn(
              'cursor-pointer bg-white text-black px-5 py-2 font-bold shadow-connectwallet-button active:shadow-none whitespace-nowrap',
              'active:shadow-none active:translate-x-1.5 active:translate-y-1.5'
            )}>
            Enter bitSmiley
          </div>
        )}
      </div>
    </div>
  )
}

const SmileyLogo: React.FC = () => {
  const { width } = useWindowSize()
  return (
    <div
      className="absolute left-0 top-[50px] z-50 flex w-screen origin-top items-start justify-between text-white"
      style={{
        padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
      }}>
      <div
        className="flex origin-top-left"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <Image src={getIconUrl('header', 'svg')} className="max-h-14" />
      </div>
    </div>
  )
}
