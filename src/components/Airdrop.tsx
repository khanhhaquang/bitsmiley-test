import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SmileAirdropIcon, RightAngleThin, CloseIcon } from '@/assets/icons'
import { Modal } from '@/components/Modal'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ActionButton } from './ActionButton'
import styles from './Airdrop.module.scss'
import { SelectWalletModal } from './ConnectWallet'
import { Image } from './Image'

export const Airdrop: React.FC<{ isAirdropPage?: boolean }> = ({
  isAirdropPage
}) => {
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(!isAirdropPage)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  const navigate = useNavigate()
  const { isConnected } = useUserInfo()

  return (
    <>
      <AirdropIntroModal
        isOpen={isIntroModalOpen}
        onClose={() => setIsIntroModalOpen(false)}
        handleOpenAirdrop={() => {
          if (isConnected) {
            navigate('/airdrop')
            return
          }
          setIsConnectModalOpen(true)
        }}
      />
      <SelectWalletModal
        hideParticle
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </>
  )
}

export const BindEvmButton: React.FC<{
  onClick: () => void
  className?: string
}> = ({ onClick }) => {
  return (
    <div className="h-[34px] w-full">
      <button
        onClick={() => onClick()}
        className={cn(
          'relative cursor-pointer flex size-full items-center justify-center whitespace-nowrap bg-green/10 uppercase text-green hover:bg-green/30 hover:font-bold hover:text-opacity-70 active:bg-green/10'
        )}>
        <span>Bind EVM Wallet</span>
        <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
        <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
      </button>
    </div>
  )
}

export const AirdropButton: React.FC<{
  onClick?: () => void
  className?: string
}> = ({ onClick, className }) => {
  const navigate = useNavigate()

  return (
    <div className={cn('w-full', className)}>
      <div className="group relative flex items-center text-[#FA0]">
        <SmileAirdropIcon className="pointer-events-none absolute left-0 z-[1] -translate-x-1/4 select-none text-[#FFAA00] group-hover:text-[#EAC641] group-active:text-[#CF6D19]" />
        <RightAngleThin className="absolute left-[-3px] top-[-3px]" />
        <RightAngleThin className="absolute right-[-3px] top-[-3px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-3px] right-[-3px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-3px] left-[-3px] -rotate-90" />
        <button
          onClick={() => (onClick ? onClick() : navigate('/airdrop'))}
          className={cn(
            'group relative cursor-pointer flex h-[30px] w-full items-center justify-center  bg-[#FFAA00] uppercase hover:bg-[#EAC641] active:bg-[#CF6D19] overflow-hidden',
            styles.airdropBtn
          )}>
          <span className="ml-6 flex items-center justify-center gap-x-1 font-psm text-base font-bold text-black">
            AIRDROP
          </span>
        </button>
      </div>
    </div>
  )
}

export const AirdropModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  const handleClose = useCallback(() => {
    onClose()
    setIsConnectModalOpen(false)
  }, [onClose])

  const connectWallet = useMemo(() => {
    return (
      <div className="flex flex-col items-center gap-y-6 text-center">
        <h2 className="text-center font-ibmb text-2xl uppercase text-[#FA0]">
          Connect to wallet
        </h2>
        <p className="w-[244px] font-ibmr text-sm text-white">
          Connect to wallet to find all your <b>$SMILE</b> airdrops!
        </p>

        <ActionButton
          className="h-[30px] w-[159px] uppercase"
          onClick={() => setIsConnectModalOpen(true)}>
          Connect wallet
        </ActionButton>
        <SelectWalletModal
          hideParticle
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
        />
      </div>
    )
  }, [isConnectModalOpen])

  const renderContent = useMemo(() => {
    return connectWallet
  }, [connectWallet])

  return (
    <Modal
      backdrop={false}
      isOpen={isOpen}
      onClose={() => {
        handleClose()
      }}>
      <div
        className={cn(
          'relative flex min-w-[400px] flex-col items-center border bg-black/75 px-12 py-9 pb-6'
        )}>
        <button
          className="absolute right-3 top-3 cursor-pointer text-white/70"
          onClick={onClose}>
          <CloseIcon width={13} height={13} />
        </button>

        <Image
          src={getIllustrationUrl('bind-wallet-modal-decorator-left', 'webp')}
          width={170}
          height={160}
          className="pointer-events-none absolute bottom-0 left-0 origin-bottom-left scale-[70%]"
        />
        <Image
          src={getIllustrationUrl('bind-wallet-modal-decorator-right', 'webp')}
          width={168}
          height={158}
          className="pointer-events-none absolute bottom-0 right-0 origin-bottom-right scale-[70%]"
        />

        {renderContent}
      </div>
    </Modal>
  )
}

const AirdropIntroModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  handleOpenAirdrop: () => void
}> = ({ isOpen, onClose, handleOpenAirdrop }) => {
  const renderContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center gap-y-6 text-center">
        <h2 className="text-center font-ibmb text-2xl uppercase text-[#FA0]">
          <Image
            src={getIllustrationUrl('bind-wallet-modal-intro-title', 'webp')}
            width={249}
            height={38}
            className="pointer-events-none"
          />
        </h2>
        <p className="w-[250px] text-center font-ibmr text-sm text-white">
          <b>$SMILE</b> airdrop is coming! Harvesting season is here!
        </p>

        <AirdropButton
          className="relative w-[153px]"
          onClick={() => {
            handleOpenAirdrop()
            onClose()
          }}
        />
      </div>
    )
  }, [handleOpenAirdrop, onClose])

  return (
    <Modal
      backdrop={false}
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}>
      <div
        className={cn(
          'relative flex min-w-[400px] flex-col items-center border bg-black/75 px-12 py-9 pb-6 border-[#EAC641]'
        )}>
        <button
          className="absolute right-3 top-3 cursor-pointer text-white/70"
          onClick={onClose}>
          <CloseIcon width={13} height={13} />
        </button>

        <Image
          src={getIllustrationUrl('bind-wallet-modal-decorator-left', 'webp')}
          width={170}
          height={160}
          className="pointer-events-none absolute bottom-0 left-0 origin-bottom-left scale-[70%]"
        />
        <Image
          src={getIllustrationUrl('bind-wallet-modal-decorator-right', 'webp')}
          width={168}
          height={158}
          className="pointer-events-none absolute bottom-0 right-0 origin-bottom-right scale-[70%]"
        />
        {renderContent}
      </div>
    </Modal>
  )
}
