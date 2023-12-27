import { useEffect, useState } from 'react'
import images from '@/scripts/resourcePaths.json'

export const usePreloadResources = () => {
  const [isLoading, setIsLoading] = useState(true)

  const loadImages = async () => {
    const imagePromises = images.map((url) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.src = new URL(url, import.meta.url).href

        img.onload = () => resolve(img)
        img.onerror = reject
      })
    })

    try {
      await Promise.all(imagePromises)
    } catch (e) {
      console.error(e)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadImages()
  }, [])

  return { isLoading }
}
