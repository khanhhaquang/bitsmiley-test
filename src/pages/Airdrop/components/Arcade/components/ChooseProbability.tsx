import { useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { cn } from '@/utils/cn'
import { formatNumberAsTrunc } from '@/utils/number'

import styles from '../../PreSeasonStake/AvailableToStake/AvailableToStake.module.scss'
import { PrizeType } from '../index.types'

const ChooseProbability: React.FC<{
  type: PrizeType
  onChoose: () => void
}> = ({ type, onChoose }) => {
  const max = 10000
  const [propability, setPropability] = useState(0.2)
  const [amount, setAmount] = useState('90')
  const onChangePercentange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target?.valueAsNumber
    if (!Number.isNaN(value)) {
      setPropability(value)
    }
    onChoose()
  }
  const onChangeAmount: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = Number(event.target?.value)
    if (!Number.isNaN(value) && value > max) {
      setAmount(max.toString())
      return
    }
    setAmount(event.target?.value)
  }
  return (
    <div className="flex w-[610px] flex-col gap-3">
      <div className="flex w-full flex-col border border-dashed border-blue bg-black/50 p-4">
        <div className="flex gap-5">
          <div className="flex w-[400px] flex-col gap-5">
            <div>CHOOSE WINNING PROBABILITY</div>
            <div className="flex gap-2">
              <div className="flex w-[350px] flex-col gap-4">
                <input
                  value={propability}
                  type="range"
                  onChange={onChangePercentange}
                  min="0"
                  max={type === PrizeType.SMILE_1000 ? 36 : 45}
                  className={cn(
                    'flex-1 text-2xl bg-transparent text-white',
                    styles.sliderInput
                  )}
                />
                <div className="flex justify-between">
                  {[0.05, 11, 22, 33, 46].map((tick) => (
                    <span key={tick}>{tick}%</span>
                  ))}
                </div>
              </div>
              <div>{`${formatNumberAsTrunc(propability)}%`}</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              USE $SMILE{' '}
              <SmileyIcon className="h-[16px] w-[14.7px] text-white" />
            </div>
            <input
              value={amount}
              onChange={onChangeAmount}
              type="number"
              className="w-[160px] border border-l-[18px] border-blue bg-transparent font-ibmb text-2xl text-white"
            />
          </div>
        </div>
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
          <div className="flex items-center gap-1">
            <SmileyIcon className="h-[16px] w-[14.7px] text-white" />
            90
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseProbability
