import PrizeOption from './PrizeOption'

import { PrizeType } from '../index.types'

const ChoosePrize: React.FC<{
  type: PrizeType
  onChoose: (value: PrizeType) => void
}> = ({ type, onChoose }) => {
  return (
    <div className="mt-3 flex h-[150px] gap-[18px]">
      <PrizeOption
        type={PrizeType.SMILE_100}
        selected={type === PrizeType.SMILE_100}
        onSelect={onChoose}
      />
      <PrizeOption
        type={PrizeType.SMILE_1000}
        selected={type === PrizeType.SMILE_1000}
        onSelect={onChoose}
      />
      <PrizeOption
        type={PrizeType.SMILE_5000}
        selected={type === PrizeType.SMILE_5000}
        onSelect={onChoose}
      />
      <PrizeOption
        type={PrizeType.SMILE_10000}
        selected={type === PrizeType.SMILE_10000}
        onSelect={onChoose}
      />
    </div>
  )
}

export default ChoosePrize
