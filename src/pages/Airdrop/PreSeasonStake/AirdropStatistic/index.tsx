import React, { ReactNode, useEffect, useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { AirdropClaimType, useAirdropClaim } from '@/hooks/useAirdropClaim'
import { useGetMyPreStake } from '@/queries/airdrop'
import { formatNumberAsTrunc } from '@/utils/number'
import ActionButton from '@/components/ActionButton'

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

const Unstaked: React.FC<{
  amount: number
  onUnstaked: () => void
}> = ({ amount, onUnstaked }) => {
  const { handleClaim, isActive } = useAirdropClaim(AirdropClaimType.UnStake)
  return (
    <div>
      <div>Unstaked $SMILE: {amount}</div>
      <div>
        <ActionButton
          className="h-[25px] w-[92px]"
          onClick={() => {
            handleClaim('Claim staking reward', onUnstaked)
          }}
          disabled={!isActive}>
          Collect
        </ActionButton>
      </div>
    </div>
  )
}

const AirdropStatistic = () => {
  const { data, refetch } = useGetMyPreStake()
  const { handleClaim, isActive } = useAirdropClaim(
    AirdropClaimType.Award,
    !!data?.data.reward
  )
  const [showUnstaked, setShowUnstaked] = useState(false)

  useEffect(() => {
    const unStakedTime = data?.data.unStakedTime ?? 0
    const now = Date.now()
    if (unStakedTime === 0) {
      setShowUnstaked(false)
      return
    }
    if (unStakedTime <= now) {
      setShowUnstaked(true)
      return
    }
    const timeountId = setTimeout(
      () => setShowUnstaked(true),
      unStakedTime - now
    )
    return () => {
      clearTimeout(timeountId)
    }
  }, [data?.data.unStakedTime])

  return (
    <div className="flex flex-col h-[124px] min-w-[1000px] items-center justify-evenly border-x-[14px] border-y border-white/40 bg-white/5 px-[72px] py-[18px] font-ibmr font-semibold backdrop-blur-[10px]">
      <div className="flex">
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
      {showUnstaked && (
        <Unstaked
          amount={data?.data.unStaked ?? 0}
          onUnstaked={() => refetch()}></Unstaked>
      )}
    </div>
  )
}

export default AirdropStatistic
