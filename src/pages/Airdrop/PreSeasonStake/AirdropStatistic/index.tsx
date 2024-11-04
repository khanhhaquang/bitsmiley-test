import React, { ReactNode, useEffect, useMemo, useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { ActionButton } from '@/components/ActionButton'
import { AirdropClaimType, useAirdropClaim } from '@/hooks/useAirdropClaim'
import { useGetMyPreStake } from '@/queries/airdrop'
import { cn } from '@/utils/cn'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { formatNumberAsTrunc } from '@/utils/number'

interface AirdropStatisticItemProps {
  label: ReactNode
  content: ReactNode
}

const formatTime = (time: number) => {
  const hour = Math.floor(time / 3600)
  const minites = Math.ceil(time / 60) % 60
  return `${hour}H${minites}M`
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

const Unstaked = () => {
  const { data } = useGetMyPreStake()
  const { isClaimed, canClaim, handleClaim, isActive, amount, refetchProofAndAmount } =
    useAirdropClaim(AirdropClaimType.UnStake)
    console.log('UnStake:', isClaimed, canClaim, isActive, amount)
  const showUnStaked = useMemo(() => {
    if (!data?.data.unStaked || data?.data.unStaked <= 0) return false
    return true
  }, [data])
  const [enableCollect, setEnableCollect] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const unStakedTime = useMemo(
    () => data?.data.unStakedTime ?? 0,
    [data?.data.unStakedTime]
  )
  const now = useMemo(() => data?.data.now ?? 0, [data?.data.now])

  useEffect(() => {
    if (unStakedTime === 0) {
      setEnableCollect(false)
      return
    }
    if (unStakedTime <= now) {
      setEnableCollect(true)
      return
    }
    setCountdown(Math.round((unStakedTime - now) / 1000))
    const interval = setInterval(() => {
      setCountdown((v) => {
        if (v > 0) return v - 1
        setEnableCollect(true)
        refetchProofAndAmount()
        // console.log('Time up')
        return v
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [enableCollect, now, unStakedTime])

  if (!showUnStaked) return null

  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-[#FFAA00]">
        Unstaked $SMILE: {formatNumberAsTrunc(data?.data.unStaked ?? 0)}
      </div>
      <div className="flex gap-3 text-white">
        {!enableCollect && <span>Collectable in: {formatTime(countdown)}</span>}
        <ActionButton
          className="h-[25px] w-[95px] bg-white text-center text-base leading-none text-black"
          onClick={() => {
            handleClaim('Claim staking reward')
          }}
          disabled={!enableCollect || !isActive || isClaimed}>
          {isClaimed ? 'Claimed' : 'Collect'}
        </ActionButton>
      </div>
    </div>
  )
}

const AirdropStatistic = () => {
  const { data, refetch } = useGetMyPreStake()
  const { projectInfo } = useProjectInfo()
  const { isClaimed, canClaim, amount, handleClaim, isActive } =
    useAirdropClaim(AirdropClaimType.Award)
  const showClaimReward = useMemo(
    () =>
      !!projectInfo?.tgeTime &&
      projectInfo?.nowTime >= projectInfo?.tgeTime &&
      amount > 0,
    [projectInfo, amount]
  )
  console.log('Reward:', isClaimed, canClaim, isActive, amount)

  return (
    <div className="flex min-w-[1000px] flex-col items-center justify-evenly gap-4 border-x-[14px] border-y border-white/40 bg-white/5 px-[72px] py-[18px] font-ibmr font-semibold backdrop-blur-[10px]">
      <div className="flex w-full">
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
              <span>{formatNumberAsTrunc(amount)}</span>
              {showClaimReward && (
                <button
                  disabled={!isActive || !canClaim || isClaimed || !amount}
                  onClick={() => {
                    console.log(isClaimed)
                    if (isClaimed) return
                    handleClaim('Claim staking reward', () => refetch())
                  }}
                  className={cn(
                    'bg-transparent text-sm font-bold text-[#FFAA00]/60 hover:text-[#FFAA00]',
                    !isClaimed && 'cursor-pointer'
                  )}>
                  {isClaimed ? 'Claimed' : 'Claim'}
                </button>
              )}
            </div>
          }
        />
      </div>
      <Unstaked />
    </div>
  )
}

export default AirdropStatistic
