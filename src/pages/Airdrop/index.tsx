import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Image } from '@/components/Image'
import { useUserInfo } from '@/hooks/useUserInfo'
import { getIsLoggedIn } from '@/store/airdrop/reducer'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import Arcade from './components/Arcade'
import ArcadeModal from './components/ArcadeModal'
import PreSeasonStake from './components/PreSeasonStake'
import PreSeasonStakeModal from './components/PreSeasonStakeModal'
import StageSelect from './components/StageSelect'
import { useAirdropLogin } from './index.hooks'
import { STAGE } from './index.types'

const Airdrop = () => {
  const navigate = useNavigate()
  const isLoggedIn = useSelector(getIsLoggedIn)
  const { isConnected } = useUserInfo()

  const [stage, setStage] = useState(STAGE.INIT)
  const [isPrecheckModalOpen, setIsPrecheckModalOpen] = useState(true)
  const [isArcadeModalOpen, setIsArcadeModalOpen] = useState(false)

  const renderStage = useMemo(() => {
    switch (stage) {
      case STAGE.SELECT:
        return <StageSelect onSelect={(v) => setStage(v)} />
      case STAGE.STAKE:
        return <PreSeasonStake onBack={() => setStage(STAGE.SELECT)} />
      case STAGE.ARCADE:
        return <Arcade />
      default:
        return null
    }
  }, [stage])

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
      <ArcadeModal
        isOpen={isArcadeModalOpen}
        onClose={() => {
          setIsArcadeModalOpen(false)
          setStage(STAGE.SELECT)
        }}
        onCheck={() => {
          setIsArcadeModalOpen(false)
          setStage(STAGE.ARCADE)
        }}
      />
      <PreSeasonStakeModal
        isOpen={isPrecheckModalOpen}
        onClose={() => {
          setIsPrecheckModalOpen(false)
          setIsArcadeModalOpen(true)
        }}
        onCheck={() => {
          setIsPrecheckModalOpen(false)
          setStage(STAGE.STAKE)
        }}
      />
      {renderStage}
    </div>
  )
}

export default Airdrop
