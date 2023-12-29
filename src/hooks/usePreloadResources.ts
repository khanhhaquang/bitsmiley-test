import { useEffect, useState } from 'react'
import images from './imgPaths.json'
import FontFaceObserver from 'fontfaceobserver'

export const usePreloadResources = () => {
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [isLoadingFonts, setIsLoadingFonts] = useState(true)

  const isLoading = isLoadingImages || isLoadingFonts

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
    } catch (error) {
      console.error('Error loading images:', error)
    }

    setIsLoadingImages(false)
  }

  const loadFonts = async () => {
    const psm = new FontFaceObserver('psm', {
      weight: 400,
      style: 'normal'
    })

    const pss = new FontFaceObserver('pss', {
      weight: 700,
      style: 'normal'
    })

    const smb = new FontFaceObserver('smb', {
      weight: 400,
      style: 'normal'
    })

    const sdm = new FontFaceObserver('sdm', {
      weight: 400,
      style: 'normal'
    })

    try {
      await Promise.all([psm.load(), pss.load(), smb.load(), sdm.load()])
    } catch (error) {
      console.error('Error loading fonts:', error)
    }

    setIsLoadingFonts(false)
  }

  useEffect(() => {
    if (!import.meta.env.PROD) {
      setIsLoadingFonts(false)
      setIsLoadingImages(false)
      return
    }

    loadFonts()
    loadImages()
  }, [])

  return { isLoading, isLoadingImages }
}
