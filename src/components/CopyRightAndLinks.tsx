import { Image } from '@/components/Image'
import { MEDIA } from '@/config/links'
import { useWindowSize } from '@/hooks/useWindowSize'
import { cn } from '@/utils/cn'
import { getIconUrl } from '@/utils/getImageUrl'

export const CopyRightAndLinks: React.FC<{
  musicControl?: boolean
  isPlayingMusic: boolean
  playMusic: () => void
  pauseMusic: () => void
}> = ({ musicControl = true, playMusic, pauseMusic, isPlayingMusic }) => {
  const { width } = useWindowSize()
  return (
    <div
      className="fixed bottom-[75px] left-0 z-50 flex w-full origin-bottom items-end justify-between px-[136px] text-white mix-blend-difference"
      style={{
        padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
      }}>
      <div
        className="flex origin-bottom-left items-center gap-x-1.5"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <span>
          <Image src={getIconUrl('copyright')} />
        </span>
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
                <svg width="14" height="14" viewBox="0 0 16 14" fill="none">
                  <path
                    d="M6.47629 0.508789H9.57153V2.36593H6.47646V4.22305H4.61932V2.36591H6.47629V0.508789ZM11.4288 0.508789H9.57164V11.6516H11.4288V0.508789ZM11.4288 11.6517H9.57164V13.5088H11.4288V11.6517ZM9.57153 11.6517H6.47629V13.5088H9.57153V11.6517ZM6.47646 9.79447H4.61932V11.6516H6.47646V9.79447ZM2.76193 4.22311H4.61891V6.08025H2.76193V7.93735H4.61891V9.79449H2.76193H2.76176H0.904785V7.93737V7.93735V6.08025V6.08023V4.22311H2.76176H2.76193ZM13.2856 6.08023H15.1427V7.93737H13.2856V6.08023ZM13.2856 2.36591H15.1427V4.22305H13.2856V2.36591ZM13.2856 9.60108H15.1427V11.4582H13.2856V9.60108Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{isPlayingMusic ? 'on' : 'off'}</span>

                <div
                  className={cn(
                    'absolute w-full bottom-1 h-0.5 invisible group-hover:visible',
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
