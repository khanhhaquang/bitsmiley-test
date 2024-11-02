import React, { ReactNode, useEffect, useMemo, useState } from 'react'

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

const Unstaked = () => {
  const { data } = useGetMyPreStake()
  const { canClaim, handleClaim, isActive } = useAirdropClaim(
    AirdropClaimType.UnStake
  )
  const showUnStaked = useMemo(() => {
    if (!data?.data.unStaked || data?.data.unStaked <= 0) return
    console.log('unstaked:', data?.data.unStaked, 'canClaim:', canClaim)
    return canClaim
  }, [data, canClaim])
  const [enableCollect, setEnableCollect] = useState(false)
  const [countdownStr, setCountdownStr] = useState('')

  useEffect(() => {
    const unStakedTime = data?.data.unStakedTime ?? 0
    const now = data?.data.now ?? 0
    console.log('unStakedTime:', unStakedTime, 'now:', now)
    if (unStakedTime === 0) {
      setEnableCollect(false)
      return
    }
    if (unStakedTime <= now) {
      setEnableCollect(true)
      return
    }
    let countdown = Math.round((unStakedTime - now) / 1000)
    const interval = setInterval(() => {
      if (countdown > 0) {
        countdown = countdown - 1
        const hour = Math.floor(countdown / 3600)
        const minites = Math.floor(countdown / 60)
        // const seconds = (countdown % 60).toString().padStart(2, '0')
        setCountdownStr(`${hour}M:${minites}M`)
      } else {
        setEnableCollect(true)
        console.log('Time up')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [data?.data.unStakedTime])

  if (!showUnStaked) return null

  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-[#FFAA00]">
        Unstaked $SMILE: {formatNumberAsTrunc(data?.data.unStaked ?? 0)}
      </div>
      <div className="flex text-white gap-3">
        {!enableCollect && <span>Collectable in: {countdownStr}</span>}
        <ActionButton
          className="h-[25px] w-[95px] bg-white text-black text-base leading-none text-center"
          onClick={() => {
            handleClaim('Claim staking reward')
          }}
          disabled={!enableCollect || !isActive}>
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

  return (
    <div className="flex flex-col min-w-[1000px] items-center justify-evenly border-x-[14px] border-y border-white/40 bg-white/5 px-[72px] py-[18px] font-ibmr font-semibold backdrop-blur-[10px] gap-4">
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
      <Unstaked></Unstaked>
    </div>
  )
}

export default AirdropStatistic
