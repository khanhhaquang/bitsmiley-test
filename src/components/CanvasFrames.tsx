import React, { useEffect, useRef, useState } from 'react'

export type CanvasFramesRef = {
  play: () => void
  stop: () => void
}

type CanvasFramesProps = {
  imgLocalPaths: string[]
  width: number
  height: number
  autoPlay?: boolean
  fps?: number
  loop?: boolean
  onStop?: () => void
}

export const CanvasFrames = React.forwardRef<
  CanvasFramesRef,
  CanvasFramesProps
>(
  (
    {
      imgLocalPaths,
      width,
      height,
      onStop,
      loop = true,
      autoPlay = true,
      fps = 30
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay)
    const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([])
    const [isLoadingImages, setIsLoadingImages] = useState(true)

    const currentIndex = useRef(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const requestRef = useRef(0)
    const lastFrameTime = useRef(0)
    const frameInterval = 1000 / fps
    const totalFrame = imgLocalPaths.length

    const play = () => {
      setIsPlaying(true)
    }

    const stop = () => {
      setIsPlaying(false)
      onStop?.()
    }

    React.useImperativeHandle(ref, () => ({ play, stop }))

    const loadImages = async () => {
      if (!totalFrame || loadedImages.length >= totalFrame) {
        setIsLoadingImages(false)
        return
      }

      const promises = imgLocalPaths.map((i) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image(width, height)
          img.width = width
          img.height = height
          img.src = i
          img.onerror = reject
          img.onload = () => {
            resolve(img)
          }
        })
      })
      const allLoadedImages = await Promise.all(promises)

      setLoadedImages(allLoadedImages)
      setIsLoadingImages(false)
    }

    const animation = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime.current

      if (elapsed > frameInterval) {
        lastFrameTime.current = currentTime

        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx || !loadedImages[currentIndex.current]) return

        ctx.clearRect(0, 0, width, height)
        ctx.save()
        ctx.drawImage(loadedImages[currentIndex.current], 0, 0, width, height)

        if (currentIndex.current >= totalFrame - 1) {
          if (!loop) {
            stop()
            return
          }
          currentIndex.current = 0
        } else {
          currentIndex.current += 1
        }
      }

      requestRef.current = requestAnimationFrame(animation)
    }

    useEffect(() => {
      if (!imgLocalPaths.length || !!loadedImages.length) return
      loadImages()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imgLocalPaths.length, loadedImages.length])

    useEffect(() => {
      if (!isLoadingImages && !!loadedImages.length && isPlaying) {
        requestRef.current = requestAnimationFrame(animation)
      }

      return () => cancelAnimationFrame(requestRef.current)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingImages, loadedImages.length, isPlaying])

    useEffect(() => {
      if (!isPlaying) {
        currentIndex.current = 0
        cancelAnimationFrame(requestRef.current)
      }
    }, [isPlaying])

    return isPlaying ? (
      <canvas ref={canvasRef} height={height} width={width} />
    ) : (
      <img
        src={loadedImages[0]?.src}
        style={{
          width,
          height
        }}
        alt="..."
      />
    )
  }
)
