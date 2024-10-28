import { FC, useMemo, useState } from 'react'

import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from '@/assets/icons'

import AirdropStatistic from './AirdropStatistic'
import AvailableToStake from './AvailableToStake'
import StakeAPY from './StakeAPY'

import { UnstakeModal } from '../ExitTokenModals'
import { useGetPreStakeInfo } from '@/queries/airdrop'

const PreSeasonStake: FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false)
  const { data } = useGetPreStakeInfo()
  const showUnStake = useMemo(() => {
    if (!data?.data.preStakeEndTime || !data?.data.nowTime) {
      return false
    }
    return data?.data.nowTime >= data?.data.preStakeEndTime
  }, [data])

  return (
    <div className="relative mt-[45px] flex flex-col items-center gap-[50px]">
      <div className="pointer-events-auto flex items-center gap-[30px]">
        <button className="cursor-pointer" onClick={() => onBack()}>
          <ArrowLeftDoubleIcon className="h-[45px] w-[53px] text-[#EAC641] hover:text-[#FFC900]" />
        </button>
        <h2
          className="text-center font-sdm text-[78px] uppercase text-yellow3"
          style={{
            WebkitTextStrokeWidth: 0.5,
            WebkitTextStrokeColor: '#EAC641'
          }}>
          PRE-SEASON Stake
        </h2>
      </div>
      <AirdropStatistic />
      <div className="flex items-stretch gap-[18px]">
        <StakeAPY />
        <AvailableToStake />
      </div>
      {showUnStake && (
        <button
          onClick={() => setIsUnstakeModalOpen(true)}
          className="mx-auto flex items-center gap-x-2 text-[#B2B2B2] hover:text-[#fff] active:text-white/50">
          <ArrowLeftDoubleIcon width={13} height={9} />
          I want to unstake
          <ArrowRightDoubleIcon width={13} height={9} />
        </button>
      )}
      <UnstakeModal
        isOpen={isUnstakeModalOpen}
        onClose={() => setIsUnstakeModalOpen(false)}
      />
    </div>
  )
}

export default PreSeasonStake
