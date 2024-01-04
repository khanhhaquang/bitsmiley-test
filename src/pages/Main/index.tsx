import { MintPage } from './MintPage'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { useIsWalletUnlocked } from '@/hooks/useIsWalletUnlocked'
import { usePreloadResources } from '@/hooks/usePreloadResources'

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const { isLoading: isLoadingArticles } = useFetchArticles()
  const { isLoading: isCheckingWallet } = useIsWalletUnlocked()
  const { isLoading: isLoadingImages } = usePreloadResources()

  const [isEntered, setIsEntered] = useState(false)

  const isLoading = isLoadingArticles || isCheckingWallet || isLoadingImages

  const audio = useMemo(() => {
    const newAudio = new Audio(
      new URL('/src/assets/mint.mp3', import.meta.url).href
    )
    newAudio.volume = 0.7
    newAudio.loop = true
    return newAudio
  }, [])

  const playMusic = useCallback(() => {
    if (audio?.currentTime !== undefined) {
      audio.currentTime = 0
    }
    audio?.play()
    setIsPlaying(true)
  }, [audio])

  const pauseMusic = () => {
    audio?.pause()
    setIsPlaying(false)
  }

  useEffect(() => {
    if (!isLoading && isEntered) {
      playMusic()
    }
  }, [isLoading, isEntered, playMusic])

  return (
    <div>
      {isLoading || !isEntered ? (
        <LoadingPage
          onEnter={() => setIsEntered(true)}
          isLoading={isLoading}
          playMusic={playMusic}
          pauseMusic={pauseMusic}
          isPlayingMusic={isPlaying}
        />
      ) : (
        <MintPage
          playMusic={playMusic}
          pauseMusic={pauseMusic}
          isPlayingMusic={isPlaying}
        />
      )}
    </div>
  )
}

export default Main
