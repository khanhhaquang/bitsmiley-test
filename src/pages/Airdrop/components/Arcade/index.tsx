import { useState } from 'react'

import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import ChoosePrize from './components/ChoosePrize'
import GameScroller from './components/GameScroller'
import { PrizeType } from './index.types'

const Arcade = () => {
  const [prizeType, setPrizeType] = useState(PrizeType.SMILE_1000)
  return (
    <div className="relative mt-[45px] flex h-[913.71px] w-[1053px] flex-col items-center bg-arcadeMachineBg bg-contain px-20 py-5 text-white">
      <div className="flex h-[100px]">122</div>
      <ChoosePrize
        type={prizeType}
        onChoose={(value) => setPrizeType(value)}></ChoosePrize>
      <GameScroller scroll={false} onStop={() => {}}></GameScroller>
      <div className="flex w-[610px] flex-col gap-3">
        <div className="flex h-[81px] w-full flex-col border border-dashed border-blue bg-black/50">
          <div>CHOOSE WINNING PROBABILITY</div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div>Potential upside</div>
            <div>1.11x</div>
          </div>
          <div className="flex justify-between">
            <div>Winning Probability</div>
            <div>45%</div>
          </div>
          <div className="flex justify-between">
            <div>USE $SMILE</div>
            <div>90</div>
          </div>
          <div className="flex w-full justify-center gap-3">
            <button>
              <Image
                src={getIllustrationUrl('simulate-button', 'gif')}
                className="h-[56px] w-[168px]"
              />
            </button>
            <button>
              <Image
                src={getIllustrationUrl('play-button-bg', 'webp')}
                className="h-[45px] w-[265px]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arcade
