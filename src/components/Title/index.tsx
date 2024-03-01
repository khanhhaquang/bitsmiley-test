import { CSSProperties, Fragment, useEffect, useRef, useState } from 'react'
import './index.scss'

export const TitleBox: React.FC<{
  message:string
  isWhite:Boolean
}> = ({ message,isWhite=false }) => {
  
  return (
    <>
      <div className={`flex justify-center font-ppnb items-center bg-white h-[71px] text-[48px] ${isWhite?'bg_White':'bg_blue'}`}>
        {message}
      </div>
    </>
  )
}

