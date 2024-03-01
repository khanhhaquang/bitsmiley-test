import React, { useState } from 'react'

interface TooltipProps {
  text: string
  children: ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    setPosition({ x: e.clientX, y: e.clientY })
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <div
      className=" relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {children}

      {showTooltip && (
        <div
          className="z-9999 fixed rounded-md bg-black p-2 text-white"
          style={{ top: position.y, left: position.x }}>
          {text}
        </div>
      )}
    </div>
  )
}

export default Tooltip
