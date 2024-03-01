import { HeaderIcon } from '@/assets/icons'
import { useWindowSize } from '@/hooks/useWindowSize'
import { ConnectWallet } from './ConnectWallet'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Header: React.FC<{ wallet?: boolean }> = ({ wallet }) => {
  const navigate = useNavigate()
  const { width } = useWindowSize()
  return (
    <div
      className="absolute left-0 top-[50px] z-50 flex w-full origin-top items-start justify-between text-white"
      style={{
        padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
      }}>
      <HeaderIcon
        onClick={() => navigate('/')}
        className="origin-top-left cursor-pointer"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}
      />
      <div className="flex">
        <button className=" mr-3">Home</button>
        <button className=" mr-3" onClick={() => navigate('/mainNet')}>
          Testnet
        </button>
        {!!wallet && (
          <ConnectWallet
            className="origin-top-right"
            style={{
              scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
            }}
          />
        )}
      </div>
    </div>
  )
}
