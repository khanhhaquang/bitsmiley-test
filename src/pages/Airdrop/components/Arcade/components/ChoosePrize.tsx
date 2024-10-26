import { PrizeType } from '../index.types'
import PrizeOption from './PrizeOption'

const ChoosePrize: React.FC<{
  type: PrizeType
  onChoose: (value: PrizeType) => void
}> = ({ type, onChoose }) => {
  return (
    <div className="h-[150px] mt-3 flex gap-[18px]">
      <PrizeOption
        type={PrizeType.SMILE_100}
        selected={type === PrizeType.SMILE_100}
        onSelect={onChoose}></PrizeOption>
      <PrizeOption
        type={PrizeType.SMILE_1000}
        selected={type === PrizeType.SMILE_1000}
        onSelect={onChoose}></PrizeOption>
      <PrizeOption
        type={PrizeType.SMILE_5000}
        selected={type === PrizeType.SMILE_5000}
        onSelect={onChoose}></PrizeOption>
      <PrizeOption
        type={PrizeType.SMILE_10000}
        selected={type === PrizeType.SMILE_10000}
        onSelect={onChoose}></PrizeOption>
    </div>
  )
}

export default ChoosePrize
