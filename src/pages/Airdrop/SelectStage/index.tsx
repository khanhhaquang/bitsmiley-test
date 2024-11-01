import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  SmileyIcon
} from '@/assets/icons'
import { ActionButton } from '@/components/ActionButton'
import { Image } from '@/components/Image'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useGetMyPreStake, useGetPreStakeInfo } from '@/queries/airdrop'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

import ArcadeModal from '../components/ArcadeModal'
import { ClaimUnlockedModal } from '../components/ExitTokenModals'
import MyJourneyModal from '../components/MyJourneyModal'
import PreSeasonStakeModal, {
  PreSeasonStakeInfo
} from '../components/PreSeasonStakeModal'

const SelectStage: React.FC = () => {
  const navigate = useNavigate()
  const [isPrecheckModalOpen, setIsPrecheckModalOpen] = useState(true)
  const [isArcadeModalOpen, setIsArcadeModalOpen] = useState(false)
  const [isMyJourneyModalOpen, setIsMyJourneyModalOpen] = useState(false)
  const [isClaimUnlockedModalOpen, setIsClaimUnlockedModalOpen] =
    useState(false)
  const { data } = useGetMyPreStake()
  const { data: preStakeInfo } = useGetPreStakeInfo()
  const { projectInfo } = useProjectInfo()

  const isArcadeReady = useMemo(() => {
    return (
      !!projectInfo?.arcadeStartTime &&
      projectInfo.nowTime >= projectInfo?.arcadeStartTime
    )
  }, [projectInfo?.arcadeStartTime, projectInfo?.nowTime])

  const showClaim = useMemo(() => {
    if (!projectInfo?.nowTime || !projectInfo.tgeTime) return false
    return projectInfo.nowTime >= projectInfo.tgeTime
  }, [projectInfo])

  const isStakeNotStarted = useMemo(() => {
    return (
      !!preStakeInfo?.data.nowTime &&
      !!preStakeInfo.data.preStakeStartTime &&
      preStakeInfo?.data.nowTime < preStakeInfo?.data.preStakeStartTime
    )
  }, [preStakeInfo?.data.nowTime, preStakeInfo?.data.preStakeStartTime])

  return (
    <div className="relative">
      <ArcadeModal
        isReady={isArcadeReady}
        isOpen={isArcadeModalOpen}
        onClose={() => {
          setIsArcadeModalOpen(false)
        }}
        onCheck={() => {
          setIsArcadeModalOpen(false)
          navigate('arcade')
        }}
      />
      <PreSeasonStakeModal
        isReady={!isStakeNotStarted}
        isOpen={isPrecheckModalOpen}
        onClose={() => {
          setIsPrecheckModalOpen(false)
          setIsArcadeModalOpen(true)
        }}
        onCheck={() => {
          navigate('pre-stake')
          setIsPrecheckModalOpen(false)
        }}
      />
      <MyJourneyModal
        onClose={() => setIsMyJourneyModalOpen(false)}
        isOpen={isMyJourneyModalOpen}
      />
      <h2
        className="mt-[45px] text-center font-sdm text-[78px] uppercase text-yellow3"
        style={{
          WebkitTextStrokeWidth: 0.5,
          WebkitTextStrokeColor: '#EAC641'
        }}>
        Airdrop
      </h2>

      <div className="mt-5 flex w-[787px] flex-col lg:mt-10 3xl:mt-[86px]">
        <div className="w-full border-[0.6px] border-[#FA0]">
          <div
            className="flex h-[31px] items-center bg-[#FA0] pl-4 font-smb text-black"
            style={{
              textShadow: '1.5px 0px 0px rgba(0, 0, 0, 0.25)'
            }}>
            YOUR TOTAL AIRDROP
          </div>

          <div className="flex h-[84px] items-center justify-between px-4">
            <p className="flex items-center gap-x-3 text-4xl font-bold text-[#FA0]">
              <SmileyIcon className="h-[48px] w-[44px] text-white" />
              {formatNumberWithSeparator(data?.data.totalAirdrop ?? 0)}
            </p>

            <button
              onClick={() => setIsMyJourneyModalOpen(true)}
              className="text-[#E0A828] underline hover:opacity-80 active:opacity-50">
              Check my journey
            </button>
          </div>
        </div>

        <div className="mt-1 flex justify-between">
          <div className="mt-12 flex flex-col">
            <PreSeasonStakeInfo
              apy={data?.data.preStakeAPY ?? 0}
              className="h-[272px]">
              <Image
                width={164}
                height={77}
                src={getIllustrationUrl('pre-season-coins-decorator-1', 'webp')}
                className="absolute bottom-0 left-0 opacity-60"
              />
              <Image
                width={144}
                height={70}
                src={getIllustrationUrl('pre-season-coins-decorator-2', 'webp')}
                className="absolute bottom-0 right-0 opacity-60"
              />
            </PreSeasonStakeInfo>
            <ActionButton
              disabled={isStakeNotStarted}
              onClick={() => navigate('pre-stake')}
              className={cn(
                'mx-auto mt-10 w-40 border-[#FFAA00]/80 bg-[#FFAA00]/80 text-2xl uppercase text-black/75',
                'hover:bg-[#FFAA00] active:bg-[#FFAA00]/60 hover:!text-black/75 active:!text-black/75',
                'w-fit min-w-[152px] disabled:border-grey2 disabled:bg-grey2/80 disabled:!text-white/50'
              )}>
              {isStakeNotStarted ? 'Not started' : 'Stake'}
            </ActionButton>
          </div>

          <div className="relative flex flex-1 flex-col">
            <div className="flex items-center">
              <Image
                src={getIllustrationUrl('arcade-effect-loop', 'gif')}
                className="absolute top-1/2 z-10 size-[360px] -translate-y-1/2 translate-x-12"
              />
              <Image
                width={177}
                height={113}
                src={getIllustrationUrl('arcade-coins-decorator', 'webp')}
                className="absolute bottom-20 left-1"
              />
              <Image
                width={240}
                height={220}
                src={getIllustrationUrl('golden-spark', 'gif')}
                className="absolute -left-20 bottom-28 scale-[40%]"
              />
              <Image
                width={240}
                height={220}
                src={getIllustrationUrl('golden-spark', 'gif')}
                className="absolute -left-16 bottom-14 scale-[40%]"
              />
              <Image
                width={177}
                height={113}
                src={getIllustrationUrl('tesla-car', 'webp')}
                className="absolute -right-10 bottom-20"
              />
              <Image
                width={240}
                height={220}
                src={getIllustrationUrl('golden-spark', 'gif')}
                className="absolute -right-28 bottom-28 scale-[40%]"
              />
              <Image
                width={240}
                height={220}
                src={getIllustrationUrl('golden-spark', 'gif')}
                className="absolute -right-24 bottom-14 scale-[40%]"
              />
            </div>
            <ActionButton
              disabled={!isArcadeReady}
              onClick={() => navigate('arcade')}
              className={cn(
                'absolute bottom-0 z-10 left-1/2 -translate-x-1/2 ml-6 w-40 border-green/80 bg-green/80 text-2xl uppercase text-black/75',
                'hover:bg-green active:bg-green/60 hover:!text-black/75 active:!text-black/75',
                'w-fit min-w-[152px] disabled:border-grey2 disabled:bg-grey2/80 disabled:!text-white/50'
              )}>
              {isArcadeReady ? 'Play' : 'Coming soon'}
            </ActionButton>
          </div>
        </div>

        {showClaim && (
          <button
            onClick={() => setIsClaimUnlockedModalOpen(true)}
            className="mx-auto mt-10 flex items-center gap-x-2 text-[#B2B2B2] hover:text-[#fff] active:text-white/50">
            <ArrowLeftDoubleIcon width={13} height={9} />
            I want to claim unlocked airdrop
            <ArrowRightDoubleIcon width={13} height={9} />
          </button>
        )}

        <ClaimUnlockedModal
          isOpen={isClaimUnlockedModalOpen}
          onClose={() => setIsClaimUnlockedModalOpen(false)}
        />
      </div>
    </div>
  )
}

export default SelectStage
