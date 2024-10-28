import { useMemo, useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { ActionButton } from '@/components/ActionButton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useGetMyPreStake } from '@/queries/airdrop'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberAsTrunc } from '@/utils/number'

import styles from './AvailableToStake.module.scss'

const AvailableToStake = () => {
  const { data } = useGetMyPreStake()
  const max = useMemo(() => data?.data.totalAirdrop ?? 0, [data])
  const [stakeAmount, setStakeAmount] = useState('0')
  const [stakePercentage, setStakePercentage] = useState(0)

  const onChangeStakeAmount: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = Number(event.target?.value)
    if (!Number.isNaN(value) && value > max) {
      setStakeAmount(max.toString())
      setStakePercentage(1)
      return
    }
    setStakePercentage(Math.floor(value / max) * 100)
    setStakeAmount(event.target?.value)
  }

  const onChangePercentange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target?.valueAsNumber

    if (!Number.isNaN(value)) {
      setStakePercentage(value)
      setStakeAmount(formatNumberAsTrunc((value * max) / 100))
    }
  }

  return (
    <div className="flex flex-col gap-[18px] font-ibmr">
      <div className="w-[534px] border border-blue/30">
        <p className="bg-blue px-4 py-[6px] font-smb text-xs uppercase text-white">
          AVAILABLE TO STAKE{' '}
          <Tooltip>
            <TooltipTrigger>ⓘ</TooltipTrigger>
            <TooltipContent>Available amount to stake</TooltipContent>
          </Tooltip>
        </p>
        <div className="flex items-center gap-3 px-4 py-3">
          <SmileyIcon className="h-[46px] w-[44px] text-white" />
          <p className="text-5xl font-semibold leading-[62px] text-white/70">
            {formatNumberAsTrunc(max)}
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="flex items-stretch gap-x-4">
        <div className="flex h-full flex-1 flex-col justify-between pt-2.5">
          <div className="relative">
            <div
              className="absolute h-[18px] w-full max-w-[98%] border-2 border-l-4 border-r-0 border-[#758CFF] bg-blue bg-repeat mix-blend-hard-light"
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
                styles.sliderInput
              )}
            />
          </div>
          <p className="flex items-center justify-between text-sm text-white/60">
            {[0, 25, 50, 75, 100].map((tick) => (
              <span key={tick}>{tick}%</span>
            ))}
          </p>
        </div>
        <div className="flex w-[95px] items-center justify-center bg-blue/20 py-4 text-2xl text-blue">
          {formatNumberAsTrunc(stakePercentage.toString(), 2)}%
        </div>
      </div>

      <div className="flex gap-x-4">
        <input
          value={stakeAmount}
          onChange={onChangeStakeAmount}
          type="number"
          className="flex-1 border border-l-[18px] border-blue bg-transparent pl-[6px] font-ibmb text-2xl text-white"
        />
        <ActionButton
          className="w-[129px] bg-white/70 text-2xl text-black/75 hover:bg-white hover:text-black/75 active:bg-white/60 active:text-black/75"
          disabled={stakePercentage === 0}>
          Stake
        </ActionButton>
      </div>
    </div>
  )
}

export default AvailableToStake
