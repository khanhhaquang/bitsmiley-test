import { useMemo, useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useBuyArcadeLucky, useGetArcadeLuckyAccount } from '@/queries/airdrop'
import { formatNumberWithSeparator, getRandomInt } from '@/utils/number'

import { ArcadeButton } from './components/ArcadeButton'
import ChoosePrize from './components/ChoosePrize'
import ChooseProbability, {
  MIN_PROBABILITY
} from './components/ChooseProbability'
import {
  CarCongratsModal,
  TokenCongratsModal
} from './components/CongratsModal'
import LockedTokensModal from './components/LockedTokensModal'
import { Prizes } from './components/PrizeOption'
import RewardScroll from './components/RewardScroll'
import { Reward } from './components/RewardsScroll.types'
import { SimulateButton } from './components/SimulateButton'
import { SmileIndicator } from './components/SmileIndicator'
import { PrizeType } from './index.types'

const Arcade = () => {
  const [prizeType, setPrizeType] = useState(PrizeType.SMILE_1000)
  const [isScrolling, setIsScrolling] = useState(false)
  const [reward, setReward] = useState(Reward.Empty)
  const [showCongratsModal, setShowCongratsModal] = useState(false)
  const [showCarCongratsModal, setShowCarCongratsModal] = useState(false)
  const [showLockedTokensModal, setShowLockedTokensModal] = useState(false)
  const [isSimulate, setIsSimulate] = useState(false)
  const [amount, setAmount] = useState('0')
  const [probability, setProbability] = useState(MIN_PROBABILITY)
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
    setIsSimulate(false)
    try {
      const resp = await buyLucky({
        type: prizeType,
        participationAmount: amount
      })
      if (resp.code === 0) {
        setWinAmount(resp.data.winAmount)
        simulate(resp.data.isWin, resp.data.luckCar)
      }
    } catch (error) {
      console.log('🚀 ~ handleStartSpinning ~ error:', error)
    }
  }

  const onStartSimulate = () => {
    setIsSimulate(true)
    simulate()
  }

  const simulate = (isWinningFromServer?: boolean, isLuckyCar?: boolean) => {
    if (!isScrolling) {
      const randomResult = getRandomInt(100) < probability
      const isWinning = isWinningFromServer ?? randomResult

      if (isLuckyCar) {
        setReward(Reward.Car)
      } else if (isWinning) {
        setReward(Reward.Tokens)
      } else {
        setReward(Reward.Empty)
      }

      if (!isWinningFromServer) {
        setWinAmount(Prizes[`${prizeType}`])
      }

      setIsScrolling(true)
    }
  }

  const onScrollResult = () => {
    setIsScrolling(false)
    fetchLuckAccount()
    if (reward === Reward.Car) {
      setShowCarCongratsModal(true)
    } else if (reward === Reward.Tokens) {
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
          <span className="flex items-center gap-1 uppercase text-[#FFD000]">
            You have won
            <SmileyIcon className="h-[16px] w-[14.7px] text-white" />
          </span>
          <span className="font-smb2 text-4xl [text-shadow:_2px_-2px_0px_rgba(0,0,0,0.25)]">
            {luckAccount?.data.haveWon ?? '--'}
          </span>
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
      <RewardScroll
        prizeType={prizeType}
        reward={reward}
        isScrolling={isScrolling}
        onEnd={onScrollResult}
        displayCar={luckAccount?.data.display}
      />
      <ChooseProbability
        probability={probability}
        prizeType={prizeType}
        amount={amount}
        setProbability={setProbability}
        setAmount={setAmount}
      />
      <p className="mt-1 flex w-full justify-center font-ibmr text-sm text-error">
        {buyResp?.code !== 0 && buyResp?.message}
      </p>
      <div className=" flex w-full items-center justify-center gap-3">
        <SimulateButton disabled={isPlayDisabled} onClick={onStartSimulate} />
        <ArcadeButton
          onClick={() => handleStartSpinning()}
          disabled={isPlayDisabled}
          className="mt-2 h-[50px] w-[265px]">
          Play
        </ArcadeButton>
      </div>
      <TokenCongratsModal
        isOpen={showCongratsModal}
        amount={winAmount}
        onClose={() => {
          setShowCongratsModal(false)
        }}
      />
      <CarCongratsModal
        isOpen={showCarCongratsModal}
        onClose={() => {
          setShowCarCongratsModal(false)
        }}
      />
      <LockedTokensModal
        isOpen={showLockedTokensModal}
        lockedFor={!isSimulate ? buyResp?.data?.lockedFor : 100}
        locked={!isSimulate ? buyResp?.data?.locked : Number(amount) || 0}
        onClose={() => {
          setShowLockedTokensModal(false)
        }}
      />
    </div>
  )
}

export default Arcade
