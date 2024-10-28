import { FC, ReactNode, useMemo, useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { ActionButton } from '@/components/ActionButton'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import StyledInput from '@/components/StyledInput'
import { useGetMyPreStake, useUnStake } from '@/queries/airdrop'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

type ExitTokenModalProps = {
  isOpen: boolean
  title?: string
  children?: ReactNode
  onCancel: () => void
  onProceed: () => void
  isPending?: boolean
}

const ExitTokenModal: FC<ExitTokenModalProps> = ({
  isOpen,
  title,
  children,
  onCancel,
  onProceed,
  isPending
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} backdrop={false}>
      <div className="relative flex min-h-[322px] w-[540px] flex-col items-center border border-blue bg-black">
        <Image
          width={132}
          className="absolute left-0 top-1/2 aspect-[402/549]  -translate-y-1/2"
          src={getIllustrationUrl('exit-token-modal-bg-smiley', 'webp')}
        />
        <Image
          width={132}
          className="absolute right-0 top-1/2 aspect-[402/549] -translate-y-1/2 scale-x-[-1]"
          src={getIllustrationUrl('exit-token-modal-bg-smiley', 'webp')}
        />
        <div
          className="relative flex h-[43px] w-full items-center justify-center bg-blue font-ibmb text-2xl uppercase text-black"
          style={{
            textShadow: '1.839px 0px 0px rgba(0, 0, 0, 0.25)'
          }}>
          {title}
        </div>
        {children}
        <div className="relative mb-6 mt-auto flex gap-x-6">
          <ActionButton
            className="h-[47px] w-[166px] bg-white/70 font-ibmb text-2xl text-black hover:bg-white hover:text-black active:bg-white/60 active:text-black"
            onClick={onCancel}>
            Cancel
          </ActionButton>
          <ActionButton
            className="h-[47px] w-[166px] border-blue bg-blue/80 font-ibmb text-2xl text-white hover:bg-blue active:bg-blue/70"
            disabled={isPending}
            onClick={onProceed}>
            Proceed
          </ActionButton>
        </div>
      </div>
    </Modal>
  )
}

export const UnstakeModal: FC<{
  onClose: () => void
  isOpen: boolean
}> = ({ onClose, isOpen }) => {
  const { data, refetch: refetchMyPreStake } = useGetMyPreStake()
  const stakedAmount = useMemo(() => data?.data.staked ?? 0, [data])
  const { mutateAsync: unStake, isPending: isUnStaking } = useUnStake({})
  const [value, setValue] = useState('')
  const onChangeAmount: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = Number(event.target?.value)
    if (!Number.isNaN(value) && value > stakedAmount) {
      setValue(stakedAmount.toString())
      return
    }
    setValue(event.target?.value)
  }
  const handleProceed = () => {
    unStake({ amount: Number(value) }).then((res) => {
      if (res.code === 0) {
        refetchMyPreStake()
        onClose()
      }
    })
  }

  return (
    <ExitTokenModal
      isOpen={isOpen}
      title="Unstake $Smile"
      isPending={isUnStaking}
      onCancel={onClose}
      onProceed={handleProceed}>
      <div className="my-6 flex flex-col items-center">
        <p className="flex items-center gap-x-1.5 text-base uppercase text-white">
          Staked $SMILE <SmileyIcon />
        </p>
        <p className="mt-1.5 font-ibmb text-2xl text-[#FFD000]">
          {formatNumberWithSeparator(stakedAmount)}
        </p>

        <div className="mt-6 flex flex-col items-center gap-y-3">
          <p className="flex items-center gap-x-1.5 text-base uppercase text-white">
            Unstake $SMILE <SmileyIcon />
          </p>
          <StyledInput
            className="h-[45px] w-[302px]"
            type="number"
            value={value}
            onChange={onChangeAmount}
          />
        </div>
      </div>
    </ExitTokenModal>
  )
}

export const ClaimUnlockedModal: FC<{
  onClose: () => void
  isOpen: boolean
}> = ({ onClose, isOpen }) => {
  const [value, setValue] = useState('')
  const handleProceed = () => {}

  return (
    <ExitTokenModal
      isOpen={isOpen}
      title="Claim unlocked  $Smile"
      onCancel={onClose}
      onProceed={handleProceed}>
      <div className="my-6 flex flex-col items-center">
        <p className="flex items-center gap-x-1.5 text-base uppercase text-white">
          Unlocked $SMILE <SmileyIcon />
        </p>
        <p className="mt-1.5 font-ibmb text-2xl text-[#FFD000]">
          {formatNumberWithSeparator(4930223)}
        </p>

        <div className="mt-6 flex flex-col items-center gap-y-3">
          <p className="flex items-center gap-x-1.5 text-base uppercase text-white">
            Claim $SMILE <SmileyIcon />
          </p>
          <StyledInput
            className="h-[45px] w-[302px]"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
    </ExitTokenModal>
  )
}
