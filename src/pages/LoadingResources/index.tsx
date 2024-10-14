import { useState } from 'react'
import { Link } from 'react-router-dom'

import { HeaderIcon, LoadingLineIcon } from '@/assets/icons'
import { Button } from '@/components/Button'
import { CanvasFrames } from '@/components/CanvasFrames'
import Typewriter from '@/components/Typewriter'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { cn } from '@/utils/cn'
import { getFrameUrl } from '@/utils/getAssetsUrl'
import { getLocalStorage } from '@/utils/storage'

const hasVisited =
  !!getLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC) &&
  getLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC) !== 'undefined'

const LoadingResources: React.FC<{
  onEnter?: () => void
  isLoading: boolean
}> = ({ isLoading: isLoadingResources, onEnter }) => {
  const [isLoadingProgress, setIsLoadingProgress] = useState(!hasVisited)
  const isLoading = isLoadingProgress || isLoadingResources

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black bg-loading bg-cover bg-center bg-no-repeat">
      <div className="absolute left-0 top-[50px] z-50 flex w-full  items-center justify-between px-12 text-white sm:justify-center">
        <Link to="/">
          <HeaderIcon />
        </Link>
      </div>

      <div className="flex flex-col items-center text-white">
        <div className="mb-12">
          <CanvasFrames
            fps={10}
            width={119}
            height={119}
            imgLocalPaths={Array(13)
              .fill(1)
              .map((_, idx) =>
                getFrameUrl('smiley-rotating', `smiley-rotating${idx + 1}`)
              )}
          />
        </div>

        {isLoading ? (
          <>
            <div className="relative mb-3 flex items-center text-lg">
              LOADING
              <div className="absolute bottom-0 left-full">
                <Typewriter
                  loop
                  speed={300}
                  cursor={false}
                  renderNodes={() => '...'}
                />
              </div>
            </div>
            {!!isLoadingProgress && (
              <div className="mb-12">
                <ProgressLine onStop={() => setIsLoadingProgress(false)} />
              </div>
            )}
          </>
        ) : (
          <Button onClick={() => onEnter?.()}>Enter bitSmiley</Button>
        )}
      </div>
    </div>
  )
}

const ProgressLine: React.FC<{ onStop: () => void }> = ({ onStop }) => {
  return (
    <div className="relative">
      <LoadingLineIcon />
      <Typewriter
        wrapperClassName="absolute left-[7px] top-[7px] flex items-center gap-x-[3px]"
        speed={120}
        cursor={false}
        onStop={onStop}
        renderNodes={(current) =>
          Array(27)
            .fill(1)
            .map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-1.5 w-1.5 bg-white invisible',
                  idx <= current && 'visible'
                )}
              />
            ))
        }
      />
    </div>
  )
}

export default LoadingResources
