import { useConnect } from 'wagmi'
import { WalletItem } from '.'
import { openUrl } from '@/utils/getAssetsUrl'
import { WALLETSITE } from '@/config/links'
import { useEvmConnectors } from '@/hooks/useEvmConnectors'
import { setLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { useConnector, useETHProvider } from '@particle-network/btc-connectkit'
import { useEffect, useMemo, useState } from 'react'

type EvmConnectorProps = {
  onClose: () => void
}

const EvmConnector: React.FC<EvmConnectorProps> = ({ onClose }) => {
  const { connect } = useConnect()
  const { okxConnector, unisatConnector, metaMaskConnector } =
    useEvmConnectors()
  const { connect: connectParticle } = useConnector()

  const [loginType, setLoginType] = useState<LoginType>()

  const { evmAccount, provider: particleEvmProvider } = useETHProvider()

  const connector = useMemo(() => {
    if (loginType === LoginType.OKX) return okxConnector
    if (loginType === LoginType.UNISAT) return unisatConnector
    return undefined
  }, [loginType, okxConnector, unisatConnector])

  useEffect(() => {
    if (!loginType || !evmAccount || !particleEvmProvider || !connector) return

    connect(
      { connector },
      { onError: (v) => console.log('connect error: ', v) }
    )
    setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, loginType)
    onClose()
  }, [connect, connector, evmAccount, loginType, onClose, particleEvmProvider])

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

          connectParticle(LoginType.OKX)
          setLoginType(LoginType.OKX)
        }}
      />
      <WalletItem
        iconName="unisat"
        name="Unisat wallet"
        connect={async () => {
          if (!window.unisat) {
            openUrl(WALLETSITE.unisat)
            return
          }

          connectParticle(LoginType.UNISAT)
          setLoginType(LoginType.UNISAT)
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

          if (!metaMaskConnector) return

          connect(
            { connector: metaMaskConnector },
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
