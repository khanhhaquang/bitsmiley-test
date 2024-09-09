import { useEffect, useRef, useState } from 'react'

import { CopyrightIcon, PlayIcon } from '@/assets/icons'
import { MEDIA } from '@/config/links'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { cn } from '@/utils/cn'
import { openUrl } from '@/utils/getAssetsUrl'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'

import { MusicPlayer, MusicPlayerRef } from './MusicPlayer'

export const CopyRightAndLinks: React.FC<{
  className?: string
  musicControl?: boolean
}> = ({ musicControl = true, className }) => {
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

    if (!musicControl || localDisablePlayMusic) {
      stopMusic()
    }
  }, [musicControl])

  return (
    <>
      <MusicPlayer ref={musicPlayerRef} isPlaying={isPlayingMusic} />
      <div
        className={cn(
          'pointer-events-none fixed bottom-[50px] left-0 z-50 flex w-full items-end justify-between text-white px-12 font-bold',
          'sm:flex-col-reverse sm:items-center sm:gap-y-12 sm:px-6 sm:relative sm:bottom-0',
          className
        )}>
        <div className="flex items-center gap-x-1.5 sm:text-xs">
          <CopyrightIcon />
          <span className="cursor-default">bitSmiley team 2024</span>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-y-1.5 sm:w-full sm:flex-row sm:items-start sm:justify-between sm:text-xs sm:text-green">
          {musicControl && (
            <span
              className={cn(
                'flex cursor-pointer items-center text-green sm:hidden',
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
