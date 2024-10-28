import { useState } from 'react'

import { ArrowLeftFilledIcon, SmileyIcon } from '@/assets/icons'
import StyledInput from '@/components/StyledInput'
import { useGetArcadeLuckyAccount } from '@/queries/airdrop'
import { formatNumberWithSeparator } from '@/utils/number'

import Slider from '../../Slider'
import { PrizeType } from '../index.types'

const ChooseProbability: React.FC<{
  type: PrizeType
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
}> = ({ amount, setAmount }) => {
  const { data: luckAccount } = useGetArcadeLuckyAccount()
  const [propability, setPropability] = useState(0.2)

  const available = luckAccount?.data.availableAirdrop || 0

  const onChangePercentage = (v: number) => {
    setPropability(v)
  }

  const onChangeAmount: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target?.valueAsNumber
    if (!Number.isNaN(value) && value > available) {
      setAmount(available.toString())
      return
    }
    setAmount(event.target?.value)
  }

  return (
    <div className="flex w-[640px] flex-col gap-3">
      <div className="flex w-full flex-col border border-blue/40 bg-blue/10 px-4 py-3">
        <div className="flex justify-between">
          <div className="flex w-[400px] flex-col gap-5">
            <span className="font-ibmb">CHOOSE WINNING PROBABILITY</span>
            <div className="relative flex gap-x-6">
              <Slider
                className="w-[310px] shrink-0"
                range={[0.05, 11, 22, 33, 46]}
                min={0.05}
                max={46}
                step={0.01}
                onInputChange={onChangePercentage}
              />
              <div className="relative flex h-9 w-[70px] items-center justify-center bg-blue p-2 text-black">
                <ArrowLeftFilledIcon className="absolute right-full" />
                {propability}%
              </div>
            </div>
          </div>
          <div className="flex w-[158px] shrink-0 flex-col gap-3">
            <span className="flex items-center gap-x-1 font-ibmb text-white">
              USE $SMILE{' '}
              <SmileyIcon width={18} height={20} className="text-white" />
            </span>
            <StyledInput
              value={amount}
              onChange={onChangeAmount}
              type="number"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5">
        <div className="flex justify-between">
          <div>Potential upside</div>
          <div>1.11x</div>
        </div>
        <div className="flex justify-between">
          <div>Winning Probability</div>
          <div>{propability}%</div>
        </div>
        <div className="flex justify-between">
          <div>USE $SMILE</div>
          <div className="flex items-center gap-x-1">
            <SmileyIcon width={18} height={20} className="text-white" />
            {formatNumberWithSeparator(amount)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseProbability
