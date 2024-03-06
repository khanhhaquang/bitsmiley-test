import { useConnect } from 'wagmi'
import { WalletItem } from '.'
import { openUrl } from '@/utils/getAssetsUrl'
import { WALLETSITE } from '@/config/links'
import { useEvmConnectors } from '@/hooks/useEvmConnectors'
import { setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'

type EvmConnectorProps = {
  onClose: () => void
}

const EvmConnector: React.FC<EvmConnectorProps> = ({ onClose }) => {
  const { connect } = useConnect()
  const connectors = useEvmConnectors()

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

          connect(
            { connector: connectors.okx },
            { onError: (v) => console.log('connect error: ', v) }
          )
          setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, LoginType.OKX)
          onClose()
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
