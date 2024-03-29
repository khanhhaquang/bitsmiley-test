import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo
} from 'react'

import { useScrollPosition } from '@/hooks/useScrollPosition'

export type MusicPlayerRef = {
  playMusic: () => void
  stopMusic: () => void
}

type MusicPlayerProps = {
  isPlaying: boolean
}

export const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(
  ({ isPlaying }, ref) => {
    const scrollPosition = useScrollPosition()

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
      audio?.play()
    }, [audio])

    const stopMusic = () => {
      audio?.pause()
    }

    useImperativeHandle(ref, () => ({ playMusic, stopMusic }))

    useEffect(() => {
      if (isPlaying) {
        audio.volume =
          0.5 - scrollPosition / 3000 > 0.1 ? 0.5 - scrollPosition / 3000 : 0.1
      }
    }, [isPlaying, scrollPosition, audio])

    return null
  }
)
