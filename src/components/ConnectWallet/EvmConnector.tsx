import { useConnector, useETHProvider } from '@particle-network/btc-connectkit'
import { useEffect, useMemo, useState } from 'react'
import { useConnect } from 'wagmi'

import { WALLETSITE } from '@/config/links'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useEvmConnectors } from '@/hooks/useEvmConnectors'
import { LoginType } from '@/types/common'
import { openUrl } from '@/utils/getAssetsUrl'
import { setLocalStorage } from '@/utils/storage'

import { WalletItem } from '.'

type EvmConnectorProps = {
  onClose: () => void
  hideParticle?: boolean
  expectedChainId?: number
}

const EvmConnector: React.FC<EvmConnectorProps> = ({
  onClose,
  hideParticle,
  expectedChainId
}) => {
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
      { connector, chainId: expectedChainId },
      { onError: (v) => console.log('connect error: ', v) }
    )
    setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, loginType)
    onClose()
  }, [
    connect,
    connector,
    evmAccount,
    expectedChainId,
    loginType,
    onClose,
    particleEvmProvider
  ])

  return (
    <>
      {!hideParticle && (
        <>
          <WalletItem
            iconName="okx"
            name="OKX wallet"
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
            name="UniSat wallet"
            connect={async () => {
              if (!window.unisat) {
                openUrl(WALLETSITE.unisat)
                return
              }

              connectParticle(LoginType.UNISAT)
              setLoginType(LoginType.UNISAT)
            }}
          />
        </>
      )}
      <WalletItem
        iconName="metamask"
        name="MetaMask wallet"
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
            { connector: metaMaskConnector, chainId: expectedChainId },
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
