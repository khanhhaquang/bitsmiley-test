// import mintMusicSrc from '@/assets/mint.mp3'
import { MintPage } from './MintPage'
import { useEffect, useRef, useState } from 'react'
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

  const audioRef = useRef<HTMLAudioElement>(null)

  const playMusic = () => {
    if (audioRef.current?.currentTime !== undefined) {
      audioRef.current.currentTime = 0
    }
    audioRef.current?.play()
    setIsPlaying(true)
  }

  const pauseMusic = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  useEffect(() => {
    if (!isLoading && isEntered) {
      playMusic()
    }
  }, [isLoading, isEntered])

  return (
    <div>
      <audio
        src={new URL('/src/assets/mint.mp3', import.meta.url).href}
        ref={audioRef}
        loop
      />

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
