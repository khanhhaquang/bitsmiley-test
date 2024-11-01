import { useMemo } from 'react'

import { getSoundUrl } from '@/utils/getAssetsUrl'

export const useSound = (soundName: string) => {
  const soundEle = useMemo(() => {
    return new Audio(getSoundUrl(soundName))
  }, [soundName])

  return soundEle
}
