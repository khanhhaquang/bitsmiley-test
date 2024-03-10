import { useConnect } from 'wagmi'
import { WalletItem } from '.'
import { openUrl } from '@/utils/getAssetsUrl'
import { WALLETSITE } from '@/config/links'
import { useEvmConnectors } from '@/hooks/useEvmConnectors'
import { setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { useConnector, useETHProvider } from '@particle-network/btc-connectkit'
import { useEffect } from 'react'

type EvmConnectorProps = {
  onClose: () => void
}

const EvmConnector: React.FC<EvmConnectorProps> = ({ onClose }) => {
  const { connect } = useConnect()
  const connectors = useEvmConnectors()
  const { connect: connectParticle } = useConnector()

  const { evmAccount, provider: particleEvmProvider } = useETHProvider()

  useEffect(() => {
    if (!evmAccount || !particleEvmProvider || !connectors.okx) return
    connect(
      { connector: connectors.okx },
      { onError: (v) => console.log('connect error: ', v) }
    )
    setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, LoginType.OKX)
    onClose()
  }, [connect, connectors.okx, evmAccount, onClose, particleEvmProvider])

  return (
    <>
      <WalletItem
        iconName="okx"
        name="Okx wallet"
        connect={() => {
          if (!window.okxwallet) {
            openUrl(WALLETSITE.okx)
            return
          }

          connectParticle('okx')
        }}
      />
      <WalletItem
        iconName="metamask"
        name="Metamask wallet"
        connect={() => {
          if (
            typeof window.ethereum === 'undefined' ||
            !window.ethereum?.isMetaMask
          ) {
            openUrl(WALLETSITE.metamask)
            return
          }

          if (!connectors.metamask) return

          connect(
            { connector: connectors.metamask },
            { onError: (v) => console.log('connect error: ', v) }
          )
          setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, LoginType.METAMASK)
          onClose()
        }}
      />
    </>
  )
}

export default EvmConnector
