import { useConnect } from 'wagmi'
import { WalletItem } from '.'
import { openUrl } from '@/utils/getAssetsUrl'
import { WALLETSITE } from '@/config/links'
import { connectors } from '@/config/wagmi'

type EvmConnectorProps = {
  onClose: () => void
}

const EvmConnector: React.FC<EvmConnectorProps> = ({ onClose }) => {
  const { connect } = useConnect()

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
          onClose()
        }}
      />
    </>
  )
}

export default EvmConnector
