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
          'cursor-pointer bg-white text-black px-5 py-2 font-bold shadow-connectwallet-button active:shadow-none whitespace-nowrap',
          'active:shadow-none active:translate-x-1.5 active:translate-y-1.5',
          className
        )}>
        {isConnected
          ? displayAddress(accountInfo.address, 4, 4)
          : 'CONNECT WALLET'}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
          <div className="relative w-[432px] whitespace-nowrap border-2 border-white bg-black bg-connect-modal font-smb text-2xl">
            <div
              onClick={() => setIsOpen(false)}
              className="absolute right-7 top-7 z-10 cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M0 0H3.59984V3.59961H7.19945V7.19944H3.59961V3.59984H0V0ZM7.19945 10.7995H3.59961V14.3993H7.19945V10.7995ZM10.7991 7.19969H14.3988V3.59986H10.7989V7.19965H7.19922V10.7995H10.7991V7.19969ZM3.59984 14.3993H0V17.9992H3.59984V14.3993ZM10.7989 10.7995H14.3988V14.3993H10.7989V10.7995ZM14.4002 0H18V3.59984H14.4002V0ZM18 14.3993H14.4002V17.9992H18V14.3993Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="px-12 py-16">
              <div className="mb-12">CONNECT WALLET</div>
              <div className="flex flex-col gap-y-6">
                <WalletItem
                  name="OKX WALLET"
                  connect={async () => {
                    await connectOkx()
                    setIsOpen(false)
                  }}
                />
                <WalletItem
                  name="UniSat WALLET"
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
}> = ({ connect, name }) => {
  return (
    <div
      className="relative flex cursor-pointer items-center gap-x-2.5 border-y-2 border-white bg-black p-2.5 pl-5"
      onClick={connect}>
      <Image src={getIconUrl('smiley')} className="w-7" />
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
