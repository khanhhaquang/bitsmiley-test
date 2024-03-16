import React, { useState, useEffect } from 'react'

import { cn } from '@/utils/cn'
interface LoadingAnimationProps {
  text?: string
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  text = 'Processing'
}) => {
  const [loadingText, setLoadingText] = useState<string>(text)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText((prevText) =>
        prevText === `${text}...` ? text : `${prevText}.`
      )
    }, 500)

    return () => {
      clearInterval(intervalId)
    }
  }, [text])

  return (
    <div className={cn('loading-container')}>
      <span>{loadingText}</span>
    </div>
  )
}

export default LoadingAnimation
