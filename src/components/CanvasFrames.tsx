import React, { useEffect, useRef, useState } from 'react'

let timer: number
export const CanvasFrames: React.FC<{
  imgLocalPaths: string[]
  width: number
  height: number
  totalFrame: number
  fps?: number
}> = ({ imgLocalPaths, width, height, totalFrame, fps = 24 }) => {
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  
  const currentIndex = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const loadImages = () => {
    if (!imgLocalPaths.length || loadedImages.length >= totalFrame) {
      setIsLoadingImages(false)
      return
    }
    imgLocalPaths.forEach((i, idx) => {
      const img = new Image(width, height)
      img.src = i
      img.onload = () => setLoadedImages((pre) => [...pre, img])

      if (idx === imgLocalPaths.length - 1) setIsLoadingImages(false)
    })
  }

  const animation = () => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !loadedImages[currentIndex.current]) return

    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.drawImage(loadedImages[currentIndex.current], 0, 0)

    if (currentIndex.current >= totalFrame - 1) {
      currentIndex.current = 0
    } else {
      currentIndex.current += 1
    }
    timer = setTimeout(animation, 1000 / fps)
  }

  useEffect(() => {
    if (!imgLocalPaths.length) return
    loadImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgLocalPaths])

  useEffect(() => {
    if (!isLoadingImages && !!loadedImages.length) {
      animation()
    }

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingImages, loadedImages.length])

  return <canvas ref={canvasRef} height={height} width={width} />
}
