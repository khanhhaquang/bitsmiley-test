import { useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { useGetArcadeLuckyAccount } from '@/queries/airdrop'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { getRandomBool } from '@/utils/number'

import { ArcadeButton } from './components/ArcadeButton'
import ChoosePrize from './components/ChoosePrize'
import ChooseProbability from './components/ChooseProbability'
import CongratsModal from './components/CongratsModal'
import GameScroller from './components/GameScroller'
import LockedTokensModal from './components/LockedTokensModal'
import { SmileButton } from './components/SmileButton'
import { PrizeType } from './index.types'

const Arcade = () => {
  const { data } = useGetArcadeLuckyAccount()
  console.log('🚀 ~ Arcade ~ data:', data)
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
        }}
      />
      <GameScroller
        scroll={scroll}
        prize={prizeType}
        isWon={isWon}
        onStop={() => {
          setScroll(false)
        }}
      />
      <ChooseProbability
        type={prizeType}
        onChoose={() => {}}></ChooseProbability>
      <div className=" flex w-full items-center justify-center gap-3">
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
        <ArcadeButton className="mt-2 h-[45px] w-[265px]">Play</ArcadeButton>
      </div>
      <CongratsModal isOpen={false} onClose={() => {}} />
      <LockedTokensModal isOpen={false} onClose={() => {}} />
    </div>
  )
}

export default Arcade
