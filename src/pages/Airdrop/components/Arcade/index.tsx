import { useState } from 'react'
import ChoosePrize from './components/ChoosePrize'
import { PrizeType } from './index.types'
import GameScroller from './components/GameScroller'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

const Arcade = () => {
  const [prizeType, setPrizeType] = useState(PrizeType.SMILE_1000)
  return (
    <div className="relative mt-[45px] w-[1053px] h-[913.71px] bg-arcadeMachineBg bg-contain px-20 py-5 flex flex-col items-center text-white">
      <div className="h-[100px] flex">122</div>
      <ChoosePrize
        type={prizeType}
        onChoose={(value) => setPrizeType(value)}></ChoosePrize>
      <GameScroller scroll={false} onStop={() => {}}></GameScroller>
      <div className="w-[610px]">
        <div className="bg-black/50 border border-blue border-dashed h-[81px] flex flex-col">
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
          <div className="flex gap-3 justify-center w-full">
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
