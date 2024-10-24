import React, { ReactNode } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { formatNumberAsTrunc } from '@/utils/number'

interface AirdropStatisticItemProps {
  label: string | ReactNode
  content: string | ReactNode
}

const AirdropStatisticItem: React.FC<AirdropStatisticItemProps> = ({
  label,
  content
}) => {
  return (
    <div>
      <div className="flex items-center gap-[5px]">
        <div className=" text-base uppercase text-[#FA0]">{label}</div>
        <SmileyIcon className="h-[21px] w-[20px] text-white" />
      </div>
      <div className="text-5xl leading-[62px] text-white/70">{content}</div>
    </div>
  )
}

const mockData = {
  totalAmount: 4853902.19,
  stake: 102.19,
  reward: 32.19
}

const AirdropStatistic = () => {
  return (
    <div className="flex items-center border-x-[14px] border-y border-white/40 bg-white/5 px-[72px] py-[18px] font-ibmr font-semibold backdrop-blur-[10px]">
      <AirdropStatisticItem
        label="Your Total Airdrop"
        content={formatNumberAsTrunc(mockData.totalAmount)}
      />
      <div className="mx-12 h-[102px] w-[1px] bg-white/30" />
      <AirdropStatisticItem
        label="Stake"
        content={formatNumberAsTrunc(mockData.stake)}
      />
      <div className="mx-12 h-[102px] w-[1px] bg-white/30" />
      <AirdropStatisticItem
        label="Reward"
        content={
          <div className="flex items-center gap-4">
            <div>{formatNumberAsTrunc(mockData.reward)}</div>
            <button className="bg-transparent text-sm font-bold text-[#FFAA00]/60 hover:text-[#FFAA00]">
              Claim
            </button>
          </div>
        }
      />
    </div>
  )
}

export default AirdropStatistic
