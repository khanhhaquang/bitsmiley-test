import { CopyrightIcon, PlayIcon } from '@/assets/icons'
import { MEDIA } from '@/config/links'
import { useWindowSize } from '@/hooks/useWindowSize'
import { cn } from '@/utils/cn'

export const CopyRightAndLinks: React.FC<{
  musicControl?: boolean
  isPlayingMusic: boolean
  playMusic: () => void
  pauseMusic: () => void
}> = ({ musicControl = true, playMusic, pauseMusic, isPlayingMusic }) => {
  const { width } = useWindowSize()
  return (
    <div
      className="fixed bottom-[50px] left-0 z-50 flex w-full origin-bottom items-end justify-between px-[136px] text-white mix-blend-difference"
      style={{
        padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
      }}>
      <div
        className="flex origin-bottom-left items-start gap-x-1.5"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <CopyrightIcon />
        <span className="cursor-default">bitSmiley team 2024</span>
      </div>

      <div
        className="flex origin-bottom-right flex-col items-end gap-y-1.5"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        {musicControl && (
          <span
            className={cn(
              'flex cursor-pointer items-center text-green',
              !isPlayingMusic && 'text-red'
            )}
            onClick={() => {
              if (isPlayingMusic) {
                pauseMusic()
                return
              }

              playMusic()
            }}>
            [
            <span className="group">
              <div className="relative flex items-center gap-x-1">
                <div className="pb-0.5">
                  <PlayIcon />
                </div>
                <span>{isPlayingMusic ? 'on' : 'off'}</span>
                <div
                  className={cn(
                    'absolute w-full bottom-1.5 h-0.5 invisible group-hover:visible',
                    isPlayingMusic ? 'bg-green' : 'bg-red'
                  )}
                />
              </div>
            </span>
            ]
          </span>
        )}
        <span
          className="cursor-pointer"
          onClick={() => window.open(MEDIA.discord, '__blank')}>
          [<span className="hover:underline active:no-underline">Discord</span>]
        </span>
        <span
          className="cursor-pointer"
          onClick={() => window.open(MEDIA.twitter, '__blank')}>
          [<span className="hover:underline active:no-underline">Twitter</span>]
        </span>
        <span
          className="cursor-pointer"
          onClick={() => window.open(MEDIA.whitePaper, '__blank')}>
          [
          <span className="hover:underline active:no-underline">
            Whitepaper
          </span>
          ]
        </span>
      </div>
    </div>
  )
}
