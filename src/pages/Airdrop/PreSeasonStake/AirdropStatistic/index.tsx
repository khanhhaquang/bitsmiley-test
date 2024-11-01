import React, { ReactNode } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { AirdropClaimType, useAirdropClaim } from '@/hooks/useAirdropClaim'
import { useGetMyPreStake } from '@/queries/airdrop'
import { formatNumberAsTrunc } from '@/utils/number'

interface AirdropStatisticItemProps {
  label: ReactNode
  content: ReactNode
}

const AirdropStatisticItem: React.FC<AirdropStatisticItemProps> = ({
  label,
  content
}) => {
  return (
    <div>
      <div className="flex items-center gap-x-[5px]">
        <span className="text-base uppercase text-[#FA0]">{label}</span>
        <SmileyIcon className="h-[21px] w-[20px] text-white" />
      </div>
      <span className="text-5xl leading-[62px] text-white/70">{content}</span>
    </div>
  )
}

const AirdropStatistic = () => {
  const { data, refetch } = useGetMyPreStake()
  const { handleClaim, isActive } = useAirdropClaim(
    AirdropClaimType.Award,
    !!data?.data.reward
  )

  return (
    <div className="flex h-[124px] min-w-[1000px] items-center justify-evenly border-x-[14px] border-y border-white/40 bg-white/5 px-[72px] py-[18px] font-ibmr font-semibold backdrop-blur-[10px]">
      <AirdropStatisticItem
        label="Your Total Airdrop"
        content={formatNumberAsTrunc(data?.data.totalAirdrop ?? 0)}
      />
      <div className="mx-12 h-full w-[1px] bg-white/30" />
      <AirdropStatisticItem
        label="Stake"
        content={formatNumberAsTrunc(data?.data.staked ?? 0)}
      />
      <div className="mx-12 h-full w-[1px] bg-white/30" />
      <AirdropStatisticItem
        label="Reward"
        content={
          <div className="flex items-center gap-4">
            <div>{formatNumberAsTrunc(data?.data.reward ?? 0)}</div>
            {!!data?.data.reward && (
              <button
                disabled={!isActive}
                onClick={() => {
                  handleClaim('Claim staking reward', () => refetch())
                }}
                className="cursor-pointer bg-transparent text-sm font-bold text-[#FFAA00]/60 hover:text-[#FFAA00]">
                Claim
              </button>
            )}
          </div>
        }
      />
    </div>
  )
}

export default AirdropStatistic
