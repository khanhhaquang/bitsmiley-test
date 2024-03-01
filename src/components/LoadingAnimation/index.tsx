import React, { useState, useEffect } from 'react'

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
  }, [])

  return (
    <div className="loading-container">
      <span>{loadingText}</span>
    </div>
  )
}

export default LoadingAnimation
