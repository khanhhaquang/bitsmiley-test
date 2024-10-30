import { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

import { Image } from '@/components/Image'
import { useUserInfo } from '@/hooks/useUserInfo'
import { getIsLoggedIn } from '@/store/airdrop/reducer'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { useAirdropLogin } from './index.hooks'

const Airdrop = () => {
  const navigate = useNavigate()
  const isLoggedIn = useSelector(getIsLoggedIn)
  const { isConnected } = useUserInfo()

  useAirdropLogin()
  useEffect(() => {
    if (!isConnected) navigate('/')
  }, [isConnected, navigate])

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-screen items-center justify-center text-white">
        Authorizing...
      </div>
    )
  }

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center overflow-x-hidden">
      <Image
        src={getIllustrationUrl('airdrop-page-cover-top', 'webp')}
        className="absolute inset-x-0 top-0 aspect-[1920/435] select-none"
      />
      <Image
        src={getIllustrationUrl('airdrop-page-cover-bottom', 'webp')}
        className="absolute inset-x-0 bottom-0 aspect-[1920/435] select-none"
      />
      <Suspense fallback="...">
        <Outlet />
      </Suspense>
    </div>
  )
}

export default Airdrop
