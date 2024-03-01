import { CSSProperties, Fragment, useEffect, useRef, useState } from 'react'
import './index.scss'

export const TitleBox: React.FC<{
  message: string
  isWhite: boolean
}> = ({ message, isWhite = false }) => {
  return (
    <>
      <div
        className={`flex h-[71px] items-center justify-center bg-white font-ppnb text-[48px] ${
          isWhite ? 'bg_White' : 'bg_blue'
        }`}>
        {message}
      </div>
    </>
  )
}
