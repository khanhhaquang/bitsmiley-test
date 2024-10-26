import { useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { getRandomBool } from '@/utils/number'

import { ArcadeButton } from './components/ArcadeButton'
import ChoosePrize from './components/ChoosePrize'
import ChooseProbability from './components/ChooseProbability'
import GameScroller from './components/GameScroller'
import { SmileButton } from './components/SmileButton'
import { PrizeType } from './index.types'

const Arcade = () => {
  const [prizeType, setPrizeType] = useState(PrizeType.SMILE_1000)
  const [scroll, setScroll] = useState(false)
  const [isWon, setIsWon] = useState(false)
  return (
    <div className="relative mt-[45px] flex h-[913.71px] w-[1053px] flex-col items-center bg-arcadeMachineBg bg-contain px-20 py-5 text-white">
      <div className="flex h-[100px] items-center gap-20">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 uppercase text-[#FFD000]">
            You have won
            <SmileyIcon className="h-[16px] w-[14.7px] text-white" />
          </div>
          <div className="font-smb2 text-4xl [text-shadow:_2px_-2px_0px_rgba(0,0,0,0.25)]">
            9,210.39
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 uppercase text-[#FFD000]">
            your rank
            <Image
              src={getIllustrationUrl('star-icon', 'webp')}
              className="size-[19px]"
            />
          </div>
          <div className="font-smb2 text-4xl [text-shadow:_2px_-2px_0px_rgba(0,0,0,0.25)]">
            #490
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <SmileButton>Available $SMILE</SmileButton>
          <SmileButton>Locked $SMILE</SmileButton>
        </div>
      </div>
      <ChoosePrize
        type={prizeType}
        onChoose={(value) => {
          if (scroll) return
          setPrizeType(value)
        }}></ChoosePrize>
      <GameScroller
        scroll={scroll}
        prize={prizeType}
        isWon={isWon}
        onStop={() => {
          setScroll(false)
        }}></GameScroller>
      <ChooseProbability
        type={prizeType}
        onChoose={() => {}}></ChooseProbability>
      <div className="flex w-full justify-center gap-3">
        <button
          onClick={() => {
            setIsWon(getRandomBool())
            setScroll(true)
          }}>
          <Image
            src={getIllustrationUrl('simulate-button', 'gif')}
            className="h-[56px] w-[168px]"
          />
        </button>
        <ArcadeButton className="mt-2 h-[45.3px] w-[265.6px] pb-2">
          Play
        </ArcadeButton>
      </div>
    </div>
  )
}

export default Arcade
