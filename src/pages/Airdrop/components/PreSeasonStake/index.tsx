import { UnionIcon } from '@/assets/icons'

import AirdropStatistic from './AirdropStatistic'
import AvailableToStake from './AvailableToStake'
import StakeAPY from './StakeAPY'

const PreSeasonStake = () => {
  return (
    <div className="mt-[45px] flex flex-col items-center gap-[50px]">
      <div className="flex items-center gap-[30px]">
        <UnionIcon className="h-[45px] w-[53px]" />
        <div className="font-sdm text-[78px] uppercase text-yellow3">
          PRE-SEASON Stake
        </div>
      </div>
      <AirdropStatistic />
      <div className="flex items-stretch gap-[18px]">
        <StakeAPY />
        <AvailableToStake />
      </div>
    </div>
  )
}

export default PreSeasonStake
