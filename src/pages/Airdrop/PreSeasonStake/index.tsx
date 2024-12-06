import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from '@/assets/icons'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useGetMyPreStake, useGetPreStakeInfo } from '@/queries/airdrop'

import AirdropStatistic from './AirdropStatistic'
import AvailableToStake from './AvailableToStake'
import StakeAPY from './StakeAPY'

import { UnstakeModal } from '../components/ExitTokenModals'

const PreSeasonStake: FC = () => {
  const navigate = useNavigate()

  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false)
  const { data } = useGetPreStakeInfo()
  const { projectInfo } = useProjectInfo()
  const { data: myPreStakeInfo } = useGetMyPreStake()

  const preStakeStartTime = useMemo(
    () => data?.data.preStakeStartTime,
    [data?.data.preStakeStartTime]
  )
  const nowTime = useMemo(() => data?.data.nowTime, [data?.data.nowTime])

  const isNotStarted = useMemo(() => {
    if (!preStakeStartTime || !nowTime) {
      return false
    }
    return nowTime < preStakeStartTime
  }, [nowTime, preStakeStartTime])

  const showUnStakeButton = useMemo(() => {
    if (
      myPreStakeInfo?.data.unStakedTime &&
      myPreStakeInfo?.data.unStakedTime > 0
    ) {
      return false
    }
    return (
      !!projectInfo?.tgeTime &&
      projectInfo?.nowTime >= projectInfo?.tgeTime &&
      import.meta.env.VITE_AIRDROP_UNSTAKE_ENABLE === 'true'
    )
  }, [projectInfo, myPreStakeInfo])

  if (isNotStarted) return null

  return (
    <div className="relative mt-[45px] flex flex-col items-center gap-[50px]">
      <div className="pointer-events-auto flex items-center gap-[30px]">
        <button className="cursor-pointer" onClick={() => navigate('/airdrop')}>
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
      {showUnStakeButton && (
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
