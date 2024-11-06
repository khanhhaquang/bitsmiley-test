import { useMemo, useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { ActionButton } from '@/components/ActionButton'
import StyledInput from '@/components/StyledInput'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  useGetMyPreStake,
  useGetPreStakeInfo,
  useStake
} from '@/queries/airdrop'
import { formatNumberAsTrunc } from '@/utils/number'

import Slider from '../../components/Slider'

const MAX_PERCENTAGE = 100

const AvailableToStake = () => {
  const { data: myPreStake, refetch: refetchMyPreStake } = useGetMyPreStake()
  const { data: preStakeInfo } = useGetPreStakeInfo()
  const [stakeAmount, setStakeAmount] = useState('0')
  const [stakePercentage, setStakePercentage] = useState(0)
  const { mutateAsync: stakeMutate, isPending: isStaking } = useStake({})

  const max = useMemo(
    () => myPreStake?.data.availableAirdrop ?? 0,
    [myPreStake]
  )

  const canStake = useMemo(() => {
    if (
      !preStakeInfo?.data.preStakeStartTime ||
      !preStakeInfo?.data.preStakeEndTime ||
      !preStakeInfo?.data.nowTime
    ) {
      return false
    }
    return (
      preStakeInfo?.data.nowTime >= preStakeInfo?.data.preStakeStartTime &&
      preStakeInfo?.data.nowTime < preStakeInfo?.data.preStakeEndTime &&
      max > 0
    )
  }, [preStakeInfo])

  const onChangeStakeAmount: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target?.valueAsNumber
    const expectedValue = Number.isNaN(value) ? 0 : value > max ? max : value

    setStakeAmount(expectedValue.toString())

    const percentage = Math.floor(expectedValue * 100) / max
    setStakePercentage(
      percentage > MAX_PERCENTAGE ? MAX_PERCENTAGE : percentage
    )
  }

  const onChangePercentage = (v: number) => {
    setStakePercentage(v)
    setStakeAmount(formatNumberAsTrunc((v * max) / 100))
  }

  const stake = () => {
    stakeMutate({ amount: Number(stakeAmount) }).then((res) => {
      if (res.code === 0) {
        refetchMyPreStake()
        setStakeAmount('0')
        setStakePercentage(0)
      }
    })
  }

  return (
    <div className="flex flex-col gap-[18px] font-ibmr">
      <div className="w-[534px] border border-blue/30">
        <div className="bg-blue px-4 py-[6px] font-smb text-xs uppercase text-white">
          AVAILABLE TO STAKE{' '}
          <Tooltip>
            <TooltipTrigger>ⓘ</TooltipTrigger>
            <TooltipContent>Available amount to stake</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <SmileyIcon className="h-[46px] w-[44px] text-white" />
          <p className="text-5xl font-semibold leading-[62px] text-white/70">
            {formatNumberAsTrunc(max)}
          </p>
        </div>
      </div>

      <div className="flex items-stretch gap-x-4">
        <Slider
          range={[0, 25, 50, 75, MAX_PERCENTAGE]}
          min={0}
          max={MAX_PERCENTAGE}
          step={1}
          disabled={!canStake}
          value={stakePercentage}
          onInputChange={onChangePercentage}
          stepsClassName="text-sm text-white/60"
          className="flex-1 pt-2"
        />

        <div className="flex w-[95px] items-center justify-center bg-blue/20 py-4 text-2xl text-blue">
          {formatNumberAsTrunc(stakePercentage)}%
        </div>
      </div>

      <div className="flex gap-x-4">
        <StyledInput
          value={stakeAmount}
          onChange={onChangeStakeAmount}
          type="number"
          disabled={!canStake}
          inputClassName="w-full"
        />
        <ActionButton
          className="w-[129px] bg-white/70 text-2xl text-black/75 hover:bg-white hover:text-black/75 active:bg-white/60 active:text-black/75"
          disabled={stakePercentage === 0 || isStaking || !canStake}
          onClick={stake}>
          Stake
        </ActionButton>
      </div>
    </div>
  )
}

export default AvailableToStake
