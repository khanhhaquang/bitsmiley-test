import { useBTCProvider } from '@particle-network/btc-connectkit'
import { CSSProperties, Fragment, useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'

import { CloseIcon } from '@/assets/icons'
import { Button } from '@/components/Button'
import { CopyButton } from '@/components/CopyButton'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import WrongNetworkModal from '@/components/WrongNetworkModal'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useDisconnectAccount } from '@/hooks/useDisconnectAccount'
import { useReconnectEvm } from '@/hooks/useReconnectEvm'
import { cn } from '@/utils/cn'
import { displayAddress } from '@/utils/formatter'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'

import EvmConnector from './EvmConnector'

import './index.scss'

const DISCLAIMER_TEXTS = [
  'Ownership and Rights: NFTs represent digital collectibles, not ownership of any assets or copyrights.',
  'Eligibility: Ensure you meet eligibility criteria and geographical restrictions before participating.',
  'Risk Acknowledgment: NFT values may fluctuate, and returns are not guaranteed. Participate only if you accept these risks.',
  'No Investment Advice: We do not provide financial advice regarding NFT purchases.',
  'No Warranty: The platform is provided "as-is" without warranties or guarantees.',
  'Security: Safeguard your account credentials. We are not responsible for unauthorized access or loss of NFTs.',
  'Regulatory Compliance: Comply with cryptocurrency and NFT transaction laws in your jurisdiction',
  "Dispute Resolution: Disputes will be resolved following bitSmiley's policies.",
  'By participating, you agree to this disclaimer. Proceed with caution and make informed decisions. For assistance, contact our support team.'
]

export const ConnectWallet: React.FC<{
  className?: string
  style?: CSSProperties
}> = ({ className, style }) => {
  const dropDownRef = useRef<HTMLDivElement>(null)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)

  useClickOutside(dropDownRef, () => setIsDropdownOpen(false))

  const disconnect = useDisconnectAccount()
  const { accounts: btcAccounts } = useBTCProvider()
  const { isError: isNetworkError, setIsError: setIsNetworkError } =
    useReconnectEvm()
  const {
    address: evmAddress,
    isConnected: isEvmConnected,
    chain: evmChain
  } = useAccount()

  const handlePress = () => {
    if (!isEvmConnected) {
      setIsConnectWalletModalOpen(true)
    }
    if (isEvmConnected && !isDropdownOpen) {
      setIsDropdownOpen(true)
    }
  }

  useEffect(() => {
    if (!evmChain && !!evmAddress) {
      setIsNetworkError(true)
    }
  }, [evmAddress, evmChain, setIsNetworkError])

  return (
    <>
      <div
        tabIndex={0}
        onClick={handlePress}
        onKeyUp={(e) => {
          if (e.code === 'Enter') {
            handlePress()
          }
        }}
        style={style}
        className={cn(
          'relative bg-white cursor-pointer text-center text-black px-5 py-2 font-bold whitespace-nowrap text-sm h-[34px] w-[158px]',
          !isDropdownOpen && 'hover:bg-blue3',
          !isEvmConnected && 'active:bg-blue',
          className
        )}>
        {isEvmConnected
          ? displayAddress(btcAccounts[0] || evmAddress, 4, 4)
          : 'Connect wallet'}

        <div
          ref={dropDownRef}
          className={cn(
            'absolute left-0 overflow-hidden top-full z-10 w-full bg-grey3 font-bold text-white h-0 text-[15px]',
            isDropdownOpen && 'h-auto border border-white border-t-transparent'
          )}>
          {!!btcAccounts[0] && (
            <CopyButton
              text={evmAddress}
              className="flex w-full cursor-pointer items-center justify-center gap-x-2.5 border-b px-5 py-2 hover:bg-grey10">
              <Image
                width={15}
                height={15}
                src={getIllustrationUrl('particle')}
              />
              {displayAddress(evmAddress, 3, 3)}
            </CopyButton>
          )}
          <button
            onClick={() => {
              disconnect()
              setIsDropdownOpen(false)
            }}
            className="flex w-full cursor-pointer items-center justify-center px-5 py-2 hover:bg-grey10">
            Logout
          </button>
        </div>
      </div>

      <WrongNetworkModal
        isOpen={isNetworkError}
        onClose={() => setIsNetworkError(false)}
      />
      <SelectWalletModal
        isOpen={isConnectWalletModalOpen}
        onClose={() => setIsConnectWalletModalOpen(false)}
      />
    </>
  )
}

export const SelectWalletModal: React.FC<{
  expectedChainId?: number
  hideParticle?: boolean
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, hideParticle, onClose, expectedChainId }) => {
  const [isConfirmed, setIsConfirmed] = useState(
    getLocalStorage(LOCAL_STORAGE_KEYS.CONFIRMED_DISCLAIMER) === 'true'
  )

  useEffect(() => {
    if (isConfirmed) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CONFIRMED_DISCLAIMER, 'true')
    }
  }, [isConfirmed])

  const renderWallets = () => {
    return (
      <>
        <CloseIcon
          onClick={onClose}
          className="absolute right-2.5 top-2.5 z-[100] cursor-pointer"
        />
        <div className="p-11">
          <div className="mb-12 whitespace-nowrap">CONNECT WALLET</div>
          <div className="mb-12 w-[336px] whitespace-pre-wrap font-psm text-sm">
            We are working on adding more wallets. Don’t have any wallet listed
            here? Select a provider below to create one.
          </div>
          {hideParticle && (
            <div className="mb-12 w-[336px] whitespace-pre-wrap font-psm text-sm text-yellow">
              Unitsat and OKX wallets are not supported now for BOB network.
            </div>
          )}
          <div className="flex flex-col gap-y-6">
            <EvmConnector
              onClose={onClose}
              hideParticle={hideParticle}
              expectedChainId={expectedChainId}
            />
          </div>
        </div>
      </>
    )
  }

  const renderDisclaimer = () => {
    return (
      <div className="px-[42px] pb-6 pt-[42px]">
        <div className="mb-12 whitespace-nowrap text-center text-2xl">
          ONE MORE THING
        </div>
        <div className="mb-6 w-[416px] whitespace-pre-wrap text-center font-psm text-sm">
          Welcome to the bitSmiley NFT Minting Event. Please read and confirm
          the following disclaimer before participating:
        </div>

        <div className="h-[280px] w-[416px] border border-dashed border-white bg-black/50 pr-[5px]">
          <div
            className={cn(
              'h-full overflow-y-scroll p-3 pr-[7px] font-psm text-sm leading-tight text-white',
              'bit-smiley-disclaimer'
            )}>
            {DISCLAIMER_TEXTS.map((t, idx) => (
              <Fragment key={idx}>
                <li className="flex items-start gap-x-2">
                  <div className="mt-2 size-[3px] shrink-0 rounded-full bg-white" />
                  <div>{t}</div>
                </li>
                {idx !== DISCLAIMER_TEXTS.length - 1 && (
                  <div className="h-2.5" />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button
            size="xs"
            className="inline-block font-psm shadow-take-bitdisc-button hover:shadow-take-bitdisc-button-hover"
            onClick={() => setIsConfirmed(true)}>
            Confirm
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop={!!isConfirmed}>
      <div className="relative border border-white/50 bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        {isConfirmed ? renderWallets() : renderDisclaimer()}
      </div>
    </Modal>
  )
}

export const WalletItem: React.FC<{
  connect: () => void
  name: string
  iconName: string
}> = ({ connect, name, iconName }) => {
  return (
    <div
      className="relative flex h-[58px] cursor-pointer items-center gap-x-3 border-y-2 border-white bg-black py-2.5 pl-5"
      onClick={connect}>
      <Image
        src={getIllustrationUrl(iconName)}
        className="aspect-square size-7"
      />
      <svg
        className="absolute -left-2"
        width="10"
        height="56"
        viewBox="0 0 10 58"
        fill="none">
        <path d="M5 0H10V58H5V53H0V5H5V0Z" fill="currentColor" />
      </svg>
      <svg
        className="absolute -right-2"
        width="10"
        height="56"
        viewBox="0 0 10 58"
        fill="none">
        <path d="M10 53V5H5.00037V0H0V58H5.00037V53H10Z" fill="currentColor" />
      </svg>
      <span className="font-psm text-2xl">{name}</span>
    </div>
  )
}
