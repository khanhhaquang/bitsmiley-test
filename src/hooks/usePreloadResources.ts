import { useCallback, useEffect, useState } from 'react'
import resourcePaths from './resourcePaths.json'
import FontFaceObserver from 'fontfaceobserver'
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

    const mediumImgs = items?.slice(0, 3)?.map((i) => {
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
