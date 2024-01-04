import { CSSProperties, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from './Modal'
import { Image } from '@/components/Image'
import { getIconUrl } from '@/utils/getImageUrl'
import { cn } from '@/utils/cn'
import { useConnectWallets } from '@/hooks/useConnectWallets'
import { getAccountInfo, getIsConnected } from '@/store/account/reducer'
import { displayAddress } from '@/utils/formatter'

export const ConnectWallet: React.FC<{
  className?: string
  style?: CSSProperties
}> = ({ className, style }) => {
  const [isOpen, setIsOpen] = useState(false)

  const isConnected = useSelector(getIsConnected)
  const accountInfo = useSelector(getAccountInfo)
  const { connectOkx, connectUnisat } = useConnectWallets()

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        style={style}
        className={cn(
          'cursor-pointer bg-white text-black px-5 py-2 font-bold shadow-connectwallet-button whitespace-nowrap',
          'hover:bg-blue3 hover:shadow-connectwallet-button-hover',
          'active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue',
          className
        )}>
        {isConnected
          ? displayAddress(accountInfo.address, 4, 4)
          : 'CONNECT WALLET'}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
          <div className="relative border-2 border-white bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
            <div
              onClick={() => setIsOpen(false)}
              className="absolute right-2.5 top-2.5 z-[100] cursor-pointer">
              <Image src={getIconUrl('close', 'svg')} />
            </div>

            <div className="p-11">
              <div className="mb-12 whitespace-nowrap">CONNECT WALLET</div>
              <div className="mb-12 w-[336px] whitespace-pre-wrap font-psm text-sm">
                We are working on adding more wallets. Don’t have any wallet
                listed here? Select a provider below to create one
              </div>
              <div className="flex flex-col gap-y-6">
                <WalletItem
                  iconName="unisat"
                  name="Unisat Wallet"
                  connect={async () => {
                    await connectUnisat()
                    setIsOpen(false)
                  }}
                />
                <WalletItem
                  iconName="okx"
                  name="OKX wallet"
                  connect={async () => {
                    await connectOkx()
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
      <Image src={getIconUrl(iconName)} className="aspect-square w-[38px]" />
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
