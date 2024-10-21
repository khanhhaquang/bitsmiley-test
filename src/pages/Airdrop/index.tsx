import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUserInfo } from '@/hooks/useUserInfo'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

const Airdrop = () => {
  const navigate = useNavigate()
  const { isConnected } = useUserInfo()

  useEffect(() => {
    if (!isConnected) navigate('/')
  }, [isConnected, navigate])

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center overflow-x-hidden">
      <img
        src={getIllustrationUrl('airdrop-page-cover-top', 'webp')}
        className="absolute inset-x-0 top-0 aspect-[1920/435]"
      />
      <img
        src={getIllustrationUrl('airdrop-page-cover-bottom', 'webp')}
        className="absolute inset-x-0 bottom-0 aspect-[1920/435]"
      />
    </div>
  )
}

export default Airdrop
