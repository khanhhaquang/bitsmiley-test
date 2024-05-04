import { useConnect } from 'wagmi'

import { WALLET_SITE } from '@/config/links'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useEvmConnectors } from '@/hooks/useEvmConnectors'
import { LoginType } from '@/types/common'
import { openUrl } from '@/utils/getAssetsUrl'
import { setLocalStorage } from '@/utils/storage'

import { WalletItem } from '.'

type EvmConnectorProps = {
  onClose: () => void
  expectedChainId?: number
}

const EvmConnectors: React.FC<EvmConnectorProps> = ({
  onClose,
  expectedChainId
}) => {
  const { connect } = useConnect()
  const { okxConnector, metaMaskConnector } = useEvmConnectors()

  return (
    <>
      <WalletItem
        iconName="metamask"
        name="Metamask"
        connect={() => {
          if (
            typeof window.ethereum === 'undefined' ||
            !window.ethereum?.isMetaMask
          ) {
            openUrl(WALLET_SITE.metamask)
            return
          }

          if (!metaMaskConnector) return

          connect(
            { connector: metaMaskConnector, chainId: expectedChainId },
            { onError: (v) => console.log('connect error: ', v) }
          )
          setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, LoginType.METAMASK)
          onClose()
        }}
      />

      <WalletItem
        iconName="okx"
        name="OKX"
        connect={() => {
          if (!window.okxwallet) {
            openUrl(WALLET_SITE.okx)
            return
          }

          if (!okxConnector) return

          connect(
            { connector: okxConnector, chainId: expectedChainId },
            { onError: (v) => console.log('connect error: ', v) }
          )
          setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, LoginType.OKX_EVM)
          onClose()
        }}
      />
    </>
  )
}

export default EvmConnectors
