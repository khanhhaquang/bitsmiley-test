import React, { useEffect, useRef, useState } from 'react'

let timer: number

export type CanvasFramesRef = {
  isPlaying: boolean
  play: () => void
  stop: () => void
}

type CanvasFramesProps = {
  imgLocalPaths: string[]
  width: number
  height: number
  autoPlay?: boolean
  fps?: number
}

export const CanvasFrames = React.forwardRef<
  CanvasFramesRef,
  CanvasFramesProps
>(({ imgLocalPaths, width, height, autoPlay = true, fps = 24 }, ref) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(true)

  const currentIndex = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const totalFrame = imgLocalPaths.length

  React.useImperativeHandle(ref, () => ({
    isPlaying,
    play: () => {
      setIsPlaying(true)
    },
    stop: () => {
      setIsPlaying(false)
    }
  }))

  const loadImages = () => {
    if (!totalFrame || loadedImages.length >= totalFrame) {
      setIsLoadingImages(false)
      return
    }
    imgLocalPaths.forEach((i, idx) => {
      const img = new Image(width, height)
      img.src = i
      img.onload = () => setLoadedImages((pre) => [...pre, img])

      if (idx === totalFrame - 1) setIsLoadingImages(false)
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
    if (!isLoadingImages && !!loadedImages.length && isPlaying) {
      animation()
    }

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingImages, loadedImages.length, isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      currentIndex.current = 0
      clearTimeout(timer)
    }
  }, [isPlaying])

  return isPlaying ? (
    <canvas ref={canvasRef} height={height} width={width} />
  ) : (
    <img src={loadedImages[0]?.src} alt="..." />
  )
})
