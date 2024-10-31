import { useMemo, useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useBuyArcadeLucky, useGetArcadeLuckyAccount } from '@/queries/airdrop'
import { formatNumberWithSeparator, getRandomBool } from '@/utils/number'

import { ArcadeButton } from './components/ArcadeButton'
import ChoosePrize from './components/ChoosePrize'
import ChooseProbability from './components/ChooseProbability'
import CongratsModal from './components/CongratsModal'
import GameScroller from './components/GameScroller'
import LockedTokensModal from './components/LockedTokensModal'
import { Prizes } from './components/PrizeOption'
import { SimulateButton } from './components/SimulateButton'
import { SmileIndicator } from './components/SmileIndicator'
import { PrizeType } from './index.types'

const Arcade = () => {
  const [prizeType, setPrizeType] = useState(PrizeType.SMILE_1000)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [showCongratsModal, setShowCongratsModal] = useState(false)
  const [showLockedTokensModal, setShowLockedTokensModal] = useState(false)
  const [amount, setAmount] = useState('0')
  const [winAmount, setWinAmount] = useState(0)
  const {
    mutateAsync: buyLucky,
    isPending: isBuying,
    data: buyResp
  } = useBuyArcadeLucky({})
  const { data: luckAccount, refetch: fetchLuckAccount } =
    useGetArcadeLuckyAccount()
  const { projectInfo } = useProjectInfo()

  const isReady = useMemo(
    () =>
      !!projectInfo?.arcadeStartTime &&
      projectInfo.nowTime >= projectInfo.arcadeStartTime,
    [projectInfo?.arcadeStartTime, projectInfo?.nowTime]
  )

  const isPlayDisabled = useMemo(
    () => isScrolling || !Number(amount) || isBuying,
    [amount, isBuying, isScrolling]
  )

  const handleStartSpinning = async () => {
    try {
      const resp = await buyLucky({
        type: prizeType,
        participationAmount: amount
      })
      if (resp.code === 0) {
        setIsWin(resp.data.isWin)
        setWinAmount(resp.data.winAmount)
        simulate(resp.data.isWin)
      }
    } catch (error) {
      console.log('🚀 ~ handleStartSpinning ~ error:', error)
    }
  }

  const simulate = (resultFromServer?: boolean) => {
    if (!isScrolling) {
      const result = resultFromServer ?? getRandomBool()
      setIsWin(result)
      if (!resultFromServer) setWinAmount(Prizes[`${prizeType}`])
      setIsScrolling(true)
    }
  }

  const onScrollResult = (isWin: boolean) => {
    setIsScrolling(false)
    fetchLuckAccount()
    if (isWin) {
      setShowCongratsModal(true)
    } else {
      setShowLockedTokensModal(true)
    }
  }

  if (!isReady) return null

  return (
    <div className="relative mt-[45px] flex h-[913.71px] w-[1053px] flex-col items-center bg-arcadeMachineBg bg-contain px-20 py-5 text-white">
      <div className="flex h-[100px] w-full items-center pl-6 pr-8">
        <div className="flex flex-1 flex-col items-center">
          <div className="flex items-center gap-1 uppercase text-[#FFD000]">
            You have won
            <SmileyIcon className="h-[16px] w-[14.7px] text-white" />
          </div>
          <div className="font-smb2 text-4xl [text-shadow:_2px_-2px_0px_rgba(0,0,0,0.25)]">
            {luckAccount?.data.haveWon ?? '--'}
          </div>
        </div>
        <div className="ml-auto flex shrink-0 flex-col items-center gap-2">
          <Tooltip delayDuration={100}>
            <TooltipContent className="flex flex-col items-center justify-center gap-y-1.5 border-blue px-6 py-3 font-ibmb">
              <span className="flex items-center gap-x-1.5 uppercase text-white">
                AVAILABLE $SMILE
                <SmileyIcon width={15} height={17} />
              </span>
              <span className="text-2xl text-[#FFD000]">
                {formatNumberWithSeparator(
                  luckAccount?.data.availableAirdrop || 0
                ) || '--'}
              </span>
            </TooltipContent>
            <TooltipTrigger>
              <SmileIndicator>Available $SMILE</SmileIndicator>
            </TooltipTrigger>
          </Tooltip>
          <Tooltip delayDuration={100}>
            <TooltipContent className="flex flex-col items-center justify-center gap-y-1.5 border-blue px-6 py-3 font-ibmb">
              <span className="flex items-center gap-x-1.5 uppercase text-white">
                LOCKED $SMILE
                <SmileyIcon width={15} height={17} />
              </span>
              <span className="text-2xl text-[#FFD000]">
                {formatNumberWithSeparator(luckAccount?.data.locked || 0) ||
                  '--'}
              </span>
            </TooltipContent>{' '}
            <TooltipTrigger>
              <SmileIndicator>Locked $SMILE</SmileIndicator>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </div>
      <ChoosePrize
        type={prizeType}
        onChoose={(value) => {
          if (isScrolling) return
          setPrizeType(value)
        }}
      />
      <GameScroller
        isScrolling={isScrolling}
        prize={prizeType}
        isWin={isWin}
        onResult={onScrollResult}
      />
      <ChooseProbability
        prizeType={prizeType}
        amount={amount}
        setAmount={setAmount}
      />
      <p className="mt-1 flex w-full justify-center font-ibmr text-sm text-error">
        {buyResp?.code !== 0 && buyResp?.message}
      </p>
      <div className=" flex w-full items-center justify-center gap-3">
        <SimulateButton
          disabled={isScrolling || isBuying}
          onClick={() => simulate()}
        />
        <ArcadeButton
          onClick={() => handleStartSpinning()}
          disabled={isPlayDisabled}
          className="mt-3 h-[45px] w-[265px]">
          Play
        </ArcadeButton>
      </div>
      <CongratsModal
        isOpen={showCongratsModal}
        amount={winAmount}
        onClose={() => {
          setShowCongratsModal(false)
        }}
      />
      <LockedTokensModal
        isOpen={showLockedTokensModal}
        lockedFor={buyResp?.data?.lockedFor}
        locked={buyResp?.data?.locked}
        onClose={() => {
          setShowLockedTokensModal(false)
        }}
      />
    </div>
  )
}

export default Arcade
