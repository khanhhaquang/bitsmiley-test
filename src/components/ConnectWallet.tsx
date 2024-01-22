import { CSSProperties, useRef, useState } from 'react'
import { Modal } from './Modal'
import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { useConnectWallets } from '@/hooks/useConnectWallets'
import { displayAddress } from '@/utils/formatter'
import { CloseIcon } from '@/assets/icons'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useClickOutside } from '@/hooks/useClickOutside'

export const ConnectWallet: React.FC<{
  className?: string
  style?: CSSProperties
}> = ({ className, style }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogoutDropdownOpen, setIsLogoutDropdownOpen] = useState(false)

  const { address, isConnected } = useUserInfo()
  const { connectOkx, connectUnisat, disConnect } = useConnectWallets()

  const buttonRef = useRef<HTMLDivElement>(null)
  useClickOutside(buttonRef, () => setIsLogoutDropdownOpen(false), true)

  return (
    <>
      <div
        ref={buttonRef}
        onClick={() => {
          if (!isConnected) {
            setIsOpen(true)
          } else {
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
          onClick={isLogoutDropdownOpen ? disConnect : undefined}
          className={cn(
            'absolute left-0 top-full z-10 flex w-full items-center justify-center bg-grey3 font-bold text-white h-0 hover:bg-grey4 text-[15px]',
            isConnected && 'transition-all ease-in-out duration-100',
            isLogoutDropdownOpen &&
              'h-auto px-5 py-2 border border-white border-t-transparent'
          )}>
          {isLogoutDropdownOpen ? 'LOGOUT' : ''}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
          <div className="relative border-2 border-white bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
            <CloseIcon
              onClick={() => setIsOpen(false)}
              className="absolute right-2.5 top-2.5 z-[100] cursor-pointer"
            />

            <div className="p-11">
              <div className="mb-12 whitespace-nowrap">CONNECT WALLET</div>
              <div className="mb-12 w-[336px] whitespace-pre-wrap font-psm text-sm">
                We are working on adding more wallets. Don’t have any wallet
                listed here? Select a provider below to create one
              </div>
              <div className="flex flex-col gap-y-6">
                <WalletItem
                  iconName="okx"
                  name="OKX Wallet"
                  connect={async () => {
                    await connectOkx()
                    setIsOpen(false)
                  }}
                />
                <WalletItem
                  iconName="unisat"
                  name="Unisat Wallet"
                  connect={async () => {
                    await connectUnisat()
                    setIsOpen(false)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
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
