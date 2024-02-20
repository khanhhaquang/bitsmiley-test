import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { CanvasFrames } from '@/components/CanvasFrames'
import { getFrameUrl } from '@/utils/getAssetsUrl'
import Typewriter from '@/components/Typewriter'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { LoadingLineIcon } from '@/assets/icons'
import { getLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'

const hasVisited =
  !!getLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC) &&
  getLocalStorage(LOCAL_STORAGE_KEYS.PLAY_MUSIC) !== 'undefined'

export const LoadingPage: React.FC<{
  onEnter: () => void
  isLoading: boolean
}> = ({ isLoading: isLoadingResources, onEnter }) => {
  const [isLoadingProgress, setIsLoadingProgress] = useState(!hasVisited)
  const isLoading = isLoadingProgress || isLoadingResources

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-black bg-loading bg-cover bg-center bg-no-repeat">
      <Header />
      <CopyRightAndLinks musicControl={false} />
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
          <Button onClick={() => onEnter()}>Enter bitSmiley</Button>
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
