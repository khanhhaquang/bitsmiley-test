import { CSSProperties, useState } from 'react'
import { Modal } from './Modal'
import { Image } from '@/components/Image'
import { getIconUrl } from '@/utils/getImageUrl'

export const ConnectWallet: React.FC<{
  className?: string
  style?: CSSProperties
}> = ({ className, style }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={className} style={style}>
        <div className="relative left-0 top-0 cursor-pointer whitespace-nowrap bg-white px-5 py-2 font-bold text-black">
          CONNECT WALLET
          <div className="absolute left-2 top-2 z-[-1] h-full w-full bg-grey2"></div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
          <div className="relative w-[432px] whitespace-nowrap border-2 border-white font-smb text-2xl">
            <div
              onClick={() => setIsOpen(false)}
              className="absolute right-7 top-7 z-10 cursor-pointer">
              <Image src={getIconUrl('close')} />
            </div>
            <div className="px-12 py-16">
              <div className="mb-12">CONNECT WALLET</div>

              <div className="relative flex items-center gap-x-2.5 border-y-2 border-white bg-black p-2.5 pl-5">


                <Image src={getIconUrl('smiley')} className="w-7" />
                <span className="font-psm">OKX Wallet</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
