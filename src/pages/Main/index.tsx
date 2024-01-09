import { MintPage } from './MintPage'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { useIsWalletUnlocked } from '@/hooks/useIsWalletUnlocked'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useScrollPosition } from '@/hooks/useScrollPosition'

const Main: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const { isLoading: isLoadingArticles } = useFetchArticles()
  const { isLoading: isCheckingWallet } = useIsWalletUnlocked()
  const { isLoading: isLoadingResources } = usePreloadResources()

  const [isEntered, setIsEntered] = useState(false)

  const scrollPosition = useScrollPosition()

  const isLoading = isLoadingArticles || isCheckingWallet || isLoadingResources

  const audio = useMemo(() => {
    const newAudio = new Audio(
      new URL('/src/assets/mint.mp3', import.meta.url).href
    )
    newAudio.preload = 'auto'
    newAudio.volume = 0.5
    newAudio.loop = true
    return newAudio
  }, [])

  const playMusic = useCallback(() => {
    if (audio?.currentTime !== undefined) {
      audio.currentTime = 0
    }
    audio?.play().then(() => {
      setIsPlaying(true)
    })
  }, [audio])

  const pauseMusic = () => {
    audio?.pause()
    setIsPlaying(false)
  }

  useEffect(() => {
    if (isPlaying) {
      audio.volume =
        0.5 - scrollPosition / 3000 > 0.1 ? 0.5 - scrollPosition / 3000 : 0.1
    }
  }, [isPlaying, scrollPosition, audio])

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
