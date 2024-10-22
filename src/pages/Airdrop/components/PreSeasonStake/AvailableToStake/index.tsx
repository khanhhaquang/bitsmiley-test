import { useState } from 'react'

import { Button } from '@/components/Button'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberAsTrunc } from '@/utils/number'
import './AvailableToStake.scss'

const max = 48539.02

const AvailableToStake = () => {
  const [stakeAmount, setStakeAmount] = useState<string>('0')
  const [stakePercentage, setStakePercentage] = useState<number>(0)

  const onChangeStakeAmount: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = Number(event.target?.value)
    if (!Number.isNaN(value) && value > max) {
      setStakeAmount(max.toString())
      setStakePercentage(1)
      return
    }
    setStakePercentage((value / max) * 100)
    setStakeAmount(event.target?.value)
  }

  const onChangePercentange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = Number(event.target?.value)

    if (!Number.isNaN(value)) {
      setStakePercentage(value)
      setStakeAmount(formatNumberAsTrunc((value * max) / 100))
    }
  }

  return (
    <div className="flex flex-col gap-[18px] font-ibmr">
      {/* Available to Stake */}
      <div className="w-[534px] border border-blue/30 ">
        <div className="bg-blue px-4 py-[6px] font-smb text-xs uppercase text-white">
          AVAILABLE TO STAKE ⓘ
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <img
            src={getIllustrationUrl('smile', 'webp')}
            className="h-[46px] w-[52px]"
          />
          <div className="text-5xl font-semibold leading-[62px] text-white/70">
            {formatNumberAsTrunc(max)}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="flex items-stretch gap-4">
        <div className="flex h-full flex-1 flex-col justify-between">
          <div className="relative mt-[10px]">
            <div
              className=" absolute h-[18px] w-full max-w-[98%] border-2 border-l-4 border-r-0 border-[#758CFF] bg-blue bg-repeat mix-blend-hard-light"
              style={{
                width: `${stakePercentage}%`,
                backgroundImage: `url(${getIllustrationUrl(
                  'stake-slider-track-bg',
                  'webp'
                )})`
              }}
            />
            <input
              value={stakePercentage}
              type="range"
              onChange={onChangePercentange}
              min="0"
              max="100"
              className={cn(
                'flex-1 text-2xl bg-transparent text-white',
                'available-stake-slider-input'
              )}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-white/60">
            {[0, 25, 50, 75, 100].map((tick) => (
              <div>{tick}%</div>
            ))}
          </div>
        </div>
        <div className="flex w-[95px] items-center justify-center bg-blue/20 py-4 text-2xl text-blue">
          {formatNumberAsTrunc(stakePercentage.toString(), 2)}%
        </div>
      </div>

      <div className="flex gap-4">
        <input
          value={stakeAmount}
          onChange={onChangeStakeAmount}
          type="number"
          className="flex-1 border border-l-[18px] border-blue bg-transparent  pl-[6px] text-2xl text-white"
        />
        <Button className="w-[129px] text-2xl" disabled={!stakeAmount}>
          Stake
        </Button>
      </div>
    </div>
  )
}

export default AvailableToStake
