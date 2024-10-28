import { useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useGetArcadeLuckyAccount } from '@/queries/airdrop'
import { getRandomBool } from '@/utils/number'

import { ArcadeButton } from './components/ArcadeButton'
import ChoosePrize from './components/ChoosePrize'
import ChooseProbability from './components/ChooseProbability'
import CongratsModal from './components/CongratsModal'
import GameScroller from './components/GameScroller'
import LockedTokensModal from './components/LockedTokensModal'
import { SimulateButton } from './components/SimulateButton'
import { SmileIndicator } from './components/SmileIndicator'
import { PrizeType } from './index.types'

const Arcade = () => {
  const { data } = useGetArcadeLuckyAccount()
  console.log('🚀 ~ Arcade ~ data:', data)
  const [prizeType, setPrizeType] = useState(PrizeType.SMILE_1000)
  const [scroll, setScroll] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [showCongratsModal, setShowCongratsModal] = useState(false)
  const [showLockedTokensModal, setShowLockedTokensModal] = useState(false)

  const simulate = () => {
    const result = getRandomBool()
    console.log('simulate:', result)
    setIsWin(result)
    setScroll(true)
  }

  const onScrollResult = (isWin: boolean) => {
    setScroll(false)
    console.log('onScrollResult:', isWin)
    if (isWin) {
      setShowCongratsModal(true)
    } else {
      setTimeout(() => {
        setShowLockedTokensModal(true)
      }, 5000)
    }
  }
  return (
    <div className="relative mt-[45px] flex h-[913.71px] w-[1053px] flex-col items-center bg-arcadeMachineBg bg-contain px-20 py-5 text-white">
      <div className="flex h-[100px] w-full items-center pl-6 pr-8">
        <div className="flex flex-1 flex-col items-center">
          <div className="flex items-center gap-1 uppercase text-[#FFD000]">
            You have won
            <SmileyIcon className="h-[16px] w-[14.7px] text-white" />
          </div>
          <div className="font-smb2 text-4xl [text-shadow:_2px_-2px_0px_rgba(0,0,0,0.25)]">
            9,210.39
          </div>
        </div>
        <div className="ml-auto flex shrink-0 flex-col items-center gap-2">
          <Tooltip>
            <TooltipContent>xxx</TooltipContent>
            <TooltipTrigger>
              <SmileIndicator>Available $SMILE</SmileIndicator>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip>
            <TooltipContent>xxx</TooltipContent>
            <TooltipTrigger>
              <SmileIndicator>Locked $SMILE</SmileIndicator>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </div>
      <ChoosePrize
        type={prizeType}
        onChoose={(value) => {
          if (scroll) return
          setPrizeType(value)
        }}
      />
      <GameScroller
        scroll={scroll}
        prize={prizeType}
        isWin={isWin}
        onResult={onScrollResult}></GameScroller>
      <ChooseProbability
        type={prizeType}
        onChoose={() => {}}></ChooseProbability>
      <div className=" flex w-full items-center justify-center gap-3">
        <SimulateButton onClick={simulate}></SimulateButton>
        <ArcadeButton className="mt-2 h-[45px] w-[265px]">Play</ArcadeButton>
      </div>
      <CongratsModal
        isOpen={showCongratsModal}
        onClose={() => {
          setShowCongratsModal(false)
        }}
      />
      <LockedTokensModal
        isOpen={showLockedTokensModal}
        onClose={() => {
          setShowLockedTokensModal(false)
        }}
      />
    </div>
  )
}

export default Arcade
