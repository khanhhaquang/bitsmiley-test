import { useMemo, useState } from 'react'

import { ArrowLeftFilledIcon, SmileyIcon } from '@/assets/icons'
import StyledInput from '@/components/StyledInput'
import { useGetArcadeLuckyAccount } from '@/queries/airdrop'
import { formatNumberAsTrunc, formatNumberWithSeparator } from '@/utils/number'

import { Prizes } from './PrizeOption'

import Slider from '../../components/Slider'
import { PrizeType } from '../index.types'

const MAX_PROBABILITY = 46

const ChooseProbability: React.FC<{
  prizeType: PrizeType
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
}> = ({ prizeType, amount, setAmount }) => {
  const { data: luckAccount } = useGetArcadeLuckyAccount()
  const [probability, setProbability] = useState(0.2)

  const available = luckAccount?.data.availableAirdrop || 0

  const max = useMemo(
    () =>
      Prizes[`${prizeType}`] > available ? available : Prizes[`${prizeType}`],
    [available, prizeType]
  )

  const upside = useMemo(() => {
    return Number(amount)
      ? formatNumberWithSeparator(Prizes[`${prizeType}`] / Number(amount))
      : '--'
  }, [amount, prizeType])

  const onChangeProbability = (v: number) => {
    setProbability(v)
    const matchedAmount = Math.floor((v / 100) * 2 * Prizes[`${prizeType}`])
    setAmount(matchedAmount > max ? max.toString() : matchedAmount.toString())
  }

  const onChangeAmount: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target?.valueAsNumber
    const expectedValue = Number.isNaN(value) ? 0 : value > max ? max : value

    setAmount(expectedValue.toString())

    const prob = Math.floor((expectedValue / Prizes[`${prizeType}`] / 2) * 100)
    setProbability(prob > MAX_PROBABILITY ? MAX_PROBABILITY : prob)
  }

  return (
    <div className="flex w-[640px] flex-col gap-y-3">
      <div className="flex w-full flex-col border border-blue/40 bg-blue/10 px-4 py-3">
        <div className="flex justify-between">
          <div className="flex w-[400px] flex-col gap-5">
            <span className="font-ibmb">CHOOSE WINNING PROBABILITY</span>
            <div className="relative flex gap-x-6">
              <Slider
                disabled={!available}
                className="w-[310px] shrink-0"
                range={[0.05, 11, 22, 33, MAX_PROBABILITY]}
                min={0.05}
                max={MAX_PROBABILITY}
                step={0.01}
                value={probability}
                onInputChange={onChangeProbability}
              />
              <div className="relative flex h-9 w-[70px] items-center justify-center bg-blue p-2 text-black">
                <ArrowLeftFilledIcon className="absolute right-full" />
                {formatNumberAsTrunc(probability)}%
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
              max={max}
              disabled={!available}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5 text-sm">
        <div className="flex justify-between">
          <span>Potential upside</span>
          <span>{upside}X</span>
        </div>
        <div className="flex justify-between">
          <span>Winning Probability</span>
          <span>{probability}%</span>
        </div>
        <div className="flex justify-between">
          <span>USE $SMILE</span>
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
