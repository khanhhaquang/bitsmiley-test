import { useConnector } from '@particle-network/btc-connectkit'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

import { CloseIcon } from '@/assets/icons'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useNativeBtcProvider } from '@/hooks/useNativeBtcProvider'
import { openUrl } from '@/utils/getAssetsUrl'
import { setLocalStorage } from '@/utils/storage'

import WalletItem from './WalletItem'

import { Modal } from '../Modal'

export const NativeBtcWalletModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { btcNetwork, switchNetwork, provider } = useNativeBtcProvider()
  const { connectors, connect } = useConnector()
  const { chain: evmChain, address: evmAddress } = useAccount()

  useEffect(() => {
    if (!evmAddress || !evmChain || !provider) return

    if (evmChain.testnet && btcNetwork === 'livenet') {
      switchNetwork('testnet')
      return
    }

    if (!evmChain.testnet && btcNetwork === 'testnet') {
      switchNetwork('livenet')
      return
    }

    onClose()
  }, [evmAddress, evmChain, btcNetwork, onClose, provider, switchNetwork])

  const renderWallets = () => {
    return (
      <>
        <button
          onClick={onClose}
          className="absolute right-2.5 top-2.5 z-[100]">
          <CloseIcon />
        </button>
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
                      setLocalStorage(
                        LOCAL_STORAGE_KEYS.BTC_LOGIN_TYPE,
                        c.metadata.id
                      )
                    } catch (error: unknown) {
                      console.error('BTC connect error: ', error)
                    }
                  } else {
                    openUrl(c.metadata.downloadUrl)
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
