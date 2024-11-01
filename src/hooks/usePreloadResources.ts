import FontFaceObserver from 'fontfaceobserver'
import { useCallback, useEffect, useState } from 'react'

import resourcePaths from './resourcePaths.json'
import { useFetchArticles } from './useFetchArticles'

export const usePreloadResources = () => {
  const { items, isLoading: isLoadingFeeds } = useFetchArticles()
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [isLoadingFonts, setIsLoadingFonts] = useState(true)

  const isLoading = isLoadingImages || isLoadingFonts || isLoadingFeeds

  const loadImages = useCallback(async () => {
    const imagePromises = resourcePaths.images.map((url) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.src = new URL(url, import.meta.url).href

        img.onload = () => resolve(img)
        img.onerror = reject
      })
    })

    const mediumImgs = items?.slice(0, 4)?.map((i) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.src = i.img as string
        img.onload = () => resolve(img)
        img.onerror = reject
      })
    })

    try {
      await Promise.all([...imagePromises, ...(mediumImgs || [])])
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setIsLoadingImages(false)
    }
  }, [items])

  const loadFonts = async () => {
    const fonts = ['psm', 'pss', 'smb', 'sdm', 'ibmb', 'ibmr', 'ppnb', 'ppbr']

    try {
      await Promise.all(
        fonts.map(
          (v) =>
            new FontFaceObserver(v, {
              weight: 400,
              style: 'normal'
            })
        )
      )
    } catch (error) {
      console.error('Error loading fonts:', error)
    } finally {
      setIsLoadingFonts(false)
    }
  }

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsLoadingFonts(false)
      setIsLoadingImages(false)
      return
    }

    if (!!items?.length && !isLoadingFeeds) {
      loadImages()
    }

    loadFonts()
  }, [items?.length, isLoadingFeeds, loadImages])

  return { isLoading, isLoadingFonts, isLoadingImages }
}
