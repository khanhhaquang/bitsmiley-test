import { useETHProvider } from '@particle-network/btc-connectkit'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAddress } from 'viem'

import { SmileAirdropIcon, RightAngleThin, CloseIcon } from '@/assets/icons'
import { Modal } from '@/components/Modal'
import { useNativeBtcProvider } from '@/hooks/useNativeBtcProvider'
import { useBindEvmAddress, useBtcCheckWallet } from '@/queries/btcWallet'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ActionButton } from './ActionButton'
import styles from './Airdrop.module.scss'
import { NativeBtcWalletModal } from './ConnectWallet/NativeBtcWalletModal'
import { Image } from './Image'
import { Input } from './ui/input'

export const Airdrop: React.FC = () => {
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(true)
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false)

  return (
    <>
      <AirdropIntroModal
        isOpen={isIntroModalOpen}
        onClose={() => setIsIntroModalOpen(false)}
        handleOpenAirdrop={() => setIsAirdropModalOpen(true)}
      />
      <AirdropModal
        isOpen={isAirdropModalOpen}
        onClose={() => setIsAirdropModalOpen(false)}
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
  const { accounts, customSignMessage } = useNativeBtcProvider()
  const { account: aaEthAccount } = useETHProvider()

  const { mutateAsync: bindEvm, isPending: isBinding } = useBindEvmAddress({})
  const {
    data: btcWalletCheckResult,
    isFetching: isCheckingBtcWallet,
    refetch: refetchBtcWalletCheck
  } = useBtcCheckWallet(accounts[0], {
    enabled: !!accounts[0]
  })

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [bindEvmAddress, setBindEvmAddress] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleClose = useCallback(() => {
    onClose()
    setErrorMsg('')
    setIsConnectModalOpen(false)
  }, [onClose])

  const handleSubmit = useCallback(async () => {
    if (!isAddress(bindEvmAddress)) {
      setErrorMsg('This address is not valid')
      return
    }

    try {
      const signature = await customSignMessage(bindEvmAddress)
      const data = await bindEvm({
        signature,
        message: bindEvmAddress,
        address: accounts[0]
      })

      if (data.code === 0) {
        refetchBtcWalletCheck()
      } else {
        setErrorMsg(data.message)
      }
    } catch (e) {
      console.log('error', e)
      setErrorMsg('Something went wrong')
    }
  }, [
    accounts,
    bindEvmAddress,
    bindEvm,
    customSignMessage,
    refetchBtcWalletCheck
  ])

  const isNotEligible = useMemo(() => {
    return btcWalletCheckResult && btcWalletCheckResult.code === -12
  }, [btcWalletCheckResult])

  const isBound = useMemo(() => {
    return btcWalletCheckResult && btcWalletCheckResult.code === -13
  }, [btcWalletCheckResult])

  const isLimitedForBinding = useMemo(() => {
    return btcWalletCheckResult && btcWalletCheckResult.code === -14
  }, [btcWalletCheckResult])

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
          disabled={isCheckingBtcWallet}
          className="h-[30px] w-[159px] uppercase"
          onClick={() => setIsConnectModalOpen(true)}>
          {isCheckingBtcWallet ? 'Waiting...' : 'Connect wallet'}
        </ActionButton>
        <NativeBtcWalletModal
          whitelistWallets={['okx', 'unisat']}
          isOpen={isConnectModalOpen}
          onClose={() => setIsConnectModalOpen(false)}
        />
      </div>
    )
  }, [isCheckingBtcWallet, isConnectModalOpen])

  const evmAddressInput = useMemo(() => {
    return (
      <div className="flex flex-col items-center gap-y-6 text-center">
        <h2 className="text-center font-ibmb text-2xl uppercase text-[#FA0]">
          Dear BTC Wallet User
        </h2>
        <p className="w-[494px] font-ibmr text-sm text-white">
          {isBound
            ? 'Your wallet has been bound successfully!'
            : 'Your wallet address is qualified for airdrop! Please provide an EVM wallet address to receive the airdrop.'}
        </p>

        {isBound ? (
          <p className="text-xs">
            Bound EVM Address:{' '}
            <span className="text-white/70">
              {btcWalletCheckResult?.data.bindEVM}
            </span>
          </p>
        ) : (
          <div className="flex min-w-[475px] flex-col items-center">
            <p className="text-xs">
              Current AA Address:{' '}
              <span className="text-white/70">{aaEthAccount}</span>
            </p>

            <Input
              className="mt-2 w-full border-white/20 bg-white/5 px-3 font-bold"
              placeholder="Input wallet address"
              value={bindEvmAddress}
              onChange={(e) => {
                setErrorMsg('')
                setBindEvmAddress(e.target.value)
              }}
            />
            <span className="mt-1 text-left text-xs text-error">
              {errorMsg}
            </span>
          </div>
        )}

        {isBound ? (
          <ActionButton className="h-[30px] w-[110px]" onClick={onClose}>
            OK
          </ActionButton>
        ) : (
          <ActionButton
            disabled={!bindEvmAddress || isBinding}
            className="h-[30px] w-[110px]"
            onClick={() => handleSubmit()}>
            {isBinding ? 'Waiting...' : 'Confirm'}
          </ActionButton>
        )}
      </div>
    )
  }, [
    isBound,
    btcWalletCheckResult?.data.bindEVM,
    aaEthAccount,
    bindEvmAddress,
    errorMsg,
    isBinding,
    onClose,
    handleSubmit
  ])

  const notEligible = useMemo(() => {
    return (
      <div className="flex flex-col items-center gap-y-6 bg-black/75 px-12 py-9 pb-6 text-center">
        <h2 className="text-center font-ibmb text-2xl uppercase text-white">
          Dear BTC Wallet User
        </h2>
        <p className="w-[323px] font-ibmr text-sm text-white">
          Unfortunately, your BTC address is not eligible for $SMILE airdrops.
        </p>

        <ActionButton
          className="h-[30px] w-[110px]"
          onClick={() => handleClose()}>
          OK
        </ActionButton>
      </div>
    )
  }, [handleClose])

  const limitedOfRequest = useMemo(() => {
    return (
      <div className="flex flex-col items-center gap-y-6 bg-black/75 px-12 py-9 pb-6 text-center">
        <h2 className="text-center font-ibmb text-2xl uppercase text-white">
          Dear BTC Wallet User
        </h2>
        <p className="w-[323px] font-ibmr text-sm text-white">
          Please retry later for binding request.
        </p>

        <ActionButton
          className="h-[30px] w-[110px]"
          onClick={() => handleClose()}>
          OK
        </ActionButton>
      </div>
    )
  }, [handleClose])

  const renderContent = useMemo(() => {
    if (!accounts.length || isCheckingBtcWallet) {
      return connectWallet
    }
    if (isNotEligible) return notEligible
    if (isLimitedForBinding) return limitedOfRequest

    return evmAddressInput
  }, [
    accounts.length,
    connectWallet,
    evmAddressInput,
    isCheckingBtcWallet,
    isLimitedForBinding,
    isNotEligible,
    limitedOfRequest,
    notEligible
  ])

  return (
    <Modal
      backdrop={false}
      isOpen={isOpen}
      onClose={() => {
        handleClose()
      }}>
      <div
        className={cn(
          'relative flex min-w-[400px] flex-col items-center border bg-black/75 px-12 py-9 pb-6',
          isNotEligible
            ? 'border-white/20 p-0.5 bg-transparent'
            : 'border-[#EAC641]'
        )}>
        <button
          className="absolute right-3 top-3 cursor-pointer text-white/70"
          onClick={onClose}>
          <CloseIcon width={13} height={13} />
        </button>
        {!isNotEligible && (
          <>
            <Image
              src={getIllustrationUrl(
                'bind-wallet-modal-decorator-left',
                'webp'
              )}
              width={170}
              height={160}
              className="pointer-events-none absolute bottom-0 left-0 origin-bottom-left scale-[70%]"
            />
            <Image
              src={getIllustrationUrl(
                'bind-wallet-modal-decorator-right',
                'webp'
              )}
              width={168}
              height={158}
              className="pointer-events-none absolute bottom-0 right-0 origin-bottom-right scale-[70%]"
            />
          </>
        )}

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
