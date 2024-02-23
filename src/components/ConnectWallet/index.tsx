import { CSSProperties, Fragment, useEffect, useRef, useState } from 'react'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/Button'
import { useBtcConnectWallet } from '@/hooks/useBtcConnectWallet'
import { displayAddress } from '@/utils/formatter'
import { CloseIcon } from '@/assets/icons'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useClickOutside } from '@/hooks/useClickOutside'
import { getLocalStorage, setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { cn } from '@/utils/cn'
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
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)
  const [isLogoutDropdownOpen, setIsLogoutDropdownOpen] = useState(false)

  const { address, isConnected } = useUserInfo()
  const { disConnect } = useBtcConnectWallet()

  const buttonRef = useRef<HTMLDivElement>(null)
  useClickOutside(buttonRef, () => setIsLogoutDropdownOpen(false))

  return (
    <>
      <div
        onClick={() => {
          if (!isConnected) {
            setIsConnectWalletModalOpen(true)
          }

          if (isConnected && !isLogoutDropdownOpen) {
            setIsLogoutDropdownOpen(true)
          }
        }}
        style={style}
        className={cn(
          'relative bg-white cursor-pointer text-black px-5 py-2 font-bold whitespace-nowrap text-[15px]',
          !isLogoutDropdownOpen && 'hover:bg-blue3',
          !isConnected &&
            'shadow-connectwallet-button hover:shadow-connectwallet-button-hover active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue',
          className
        )}>
        {isConnected ? displayAddress(address, 4, 4) : 'CONNECT WALLET'}

        <div
          ref={buttonRef}
          onClick={() => {
            disConnect()
            setIsLogoutDropdownOpen(false)
          }}
          className={cn(
            'absolute left-0 top-full z-10 flex w-full items-center justify-center bg-grey3 font-bold text-white h-0 hover:bg-grey4 text-[15px]',
            isConnected && 'transition-all ease-in-out duration-100',
            isLogoutDropdownOpen &&
              'h-auto px-5 py-2 border border-white border-t-transparent'
          )}>
          {isLogoutDropdownOpen ? 'LOGOUT' : ''}
        </div>
      </div>

      <SelectWalletModal
        isOpen={isConnectWalletModalOpen}
        onClose={() => setIsConnectWalletModalOpen(false)}
      />
    </>
  )
}

const SelectWalletModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { connectOkx, connectUnisat } = useBtcConnectWallet()

  useEffect(() => {
    const isConfirmedLocal = getLocalStorage(LOCAL_STORAGE_KEYS.CONFIRMED)
    if (isConfirmedLocal === 'true') {
      setIsConfirmed(true)
    }
  }, [])

  useEffect(() => {
    if (isConfirmed) {
      setLocalStorage(LOCAL_STORAGE_KEYS.CONFIRMED, 'true')
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
            here? Select a provider below to create one
          </div>
          <div className="flex flex-col gap-y-6">
            <WalletItem
              iconName="okx"
              name="OKX Wallet"
              connect={async () => {
                await connectOkx()
                onClose()
              }}
            />
            <WalletItem
              iconName="unisat"
              name="Unisat Wallet"
              connect={async () => {
                await connectUnisat()
                onClose()
              }}
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
                  <div className="mt-2 h-[3px] w-[3px] shrink-0 rounded-full bg-white" />
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
      <div className="relative border-2 border-white bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        {isConfirmed ? renderWallets() : renderDisclaimer()}
      </div>
    </Modal>
  )
}

const WalletItem: React.FC<{
  connect: () => void
  name: string
  iconName: string
}> = ({ connect, name, iconName }) => {
  return (
    <div
      className="relative flex cursor-pointer items-center gap-x-3 border-y-2 border-white bg-black py-2.5 pl-5"
      onClick={connect}>
      <Image
        src={getIllustrationUrl(iconName)}
        className="aspect-square w-[38px]"
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
      <span className="font-psm">{name}</span>
    </div>
  )
}
