import { useConnector } from '@particle-network/btc-connectkit'

import { CloseIcon } from '@/assets/icons'

import WalletItem from './WalletItem'

import { Modal } from '../Modal'

export const NativeBtcWalletModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { connectors, connect } = useConnector()

  const renderWallets = () => {
    return (
      <>
        <CloseIcon
          onClick={onClose}
          className="absolute right-2.5 top-2.5 z-[100] cursor-pointer"
        />
        <div className="p-11">
          <h2 className="mb-9 text-center font-smb text-2xl text-white">
            CONNECT BTC WALLET
          </h2>
          <div className="flex flex-col items-center gap-y-6">
            {connectors.map((c) => (
              <WalletItem
                key={c.metadata.id}
                iconName={c.metadata.id}
                name={c.metadata.name}
                connect={async () => {
                  if (c.isReady()) {
                    try {
                      await connect(c.metadata.id)
                      onClose()
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                      console.error('onConnect error', error)
                    }
                  }
                }}
              />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        {renderWallets()}
      </div>
    </Modal>
  )
}

export default NativeBtcWalletModal
