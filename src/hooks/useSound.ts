import { useMemo } from 'react'

import { getSoundUrl } from '@/utils/getAssetsUrl'

type AudioConfig = {
  volume?: number
}

export const useSound = (soundName: string, config?: AudioConfig) => {
  const soundEle = useMemo(() => {
    const audio = new Audio(getSoundUrl(soundName))
    audio.volume = config?.volume || 1
    return audio
  }, [config?.volume, soundName])

  return soundEle
}
