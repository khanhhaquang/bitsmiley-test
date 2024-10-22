import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Image } from '@/components/Image'
import { useUserInfo } from '@/hooks/useUserInfo'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import ArcadeModal from './components/ArcadeModal'
import PreSeasonStakeModal from './components/PreSeasonStakeModal'
import StageSelect from './components/StageSelect'

export enum STAGE {
  INIT,
  SELECT,
  STAKE,
  ARCADE
}

const Airdrop = () => {
  const navigate = useNavigate()
  const { isConnected } = useUserInfo()

  const [stage, setStage] = useState(STAGE.INIT)
  const [isPrecheckModalOpen, setIsPrecheckModalOpen] = useState(true)
  const [isArcadeModalOpen, setIsArcadeModalOpen] = useState(false)

  const renderStage = useMemo(() => {
    switch (stage) {
      case STAGE.SELECT:
        return <StageSelect />
      case STAGE.ARCADE:
        return <div>Arcade</div>
      case STAGE.STAKE:
        return <div>Stake</div>
      default:
        return null
    }
  }, [stage])

  useEffect(() => {
    if (!isConnected) navigate('/')
  }, [isConnected, navigate])

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
