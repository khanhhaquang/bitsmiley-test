import { CopyrightIcon, PlayIcon } from '@/assets/icons'
import { MEDIA } from '@/config/links'
import { useWindowSize } from '@/hooks/useWindowSize'
import { cn } from '@/utils/cn'
import { useEffect, useRef, useState } from 'react'
import { MusicPlayer, MusicPlayerRef } from './MusicPlayer'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { openUrl } from '@/utils/getAssetsUrl'

export const CopyRightAndLinks: React.FC<{
  musicControl?: boolean
}> = ({ musicControl = true }) => {
  const { width } = useWindowSize()
  const musicPlayerRef = useRef<MusicPlayerRef>(null)
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)

  const playMusic = () => {
    musicPlayerRef.current?.playMusic()
    setIsPlayingMusic(true)
    setLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC, 'true')
  }

  const stopMusic = () => {
    musicPlayerRef.current?.stopMusic()
    setIsPlayingMusic(false)
    setLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC, 'false')
  }

  useEffect(() => {
    const localDisablePlayMusic =
      getLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC) === 'false'

    if (musicControl && !localDisablePlayMusic) {
      playMusic()
    }
  }, [musicControl])

  return (
    <>
      <MusicPlayer ref={musicPlayerRef} isPlaying={isPlayingMusic} />
      <div
        className="pointer-events-none fixed bottom-[50px] left-0 z-50 flex w-full items-end justify-between px-[136px] text-white mix-blend-difference"
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
          className="pointer-events-auto flex origin-bottom-right flex-col items-end gap-y-1.5"
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
                  stopMusic()
                } else {
                  playMusic()
                }
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
            onClick={() => openUrl(MEDIA.discord)}>
            [
            <span className="hover:underline active:no-underline">Discord</span>
            ]
          </span>
          <span
            className="cursor-pointer"
            onClick={() => openUrl(MEDIA.twitter)}>
            [
            <span className="hover:underline active:no-underline">Twitter</span>
            ]
          </span>
          <span
            className="cursor-pointer"
            onClick={() => openUrl(MEDIA.whitePaper)}>
            [
            <span className="hover:underline active:no-underline">
              Whitepaper
            </span>
            ]
          </span>
        </div>
      </div>
    </>
  )
}
