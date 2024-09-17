import { useConnector, useETHProvider } from '@particle-network/btc-connectkit'
import { useEffect, useMemo, useState } from 'react'
import { useConnect } from 'wagmi'

import { WALLET_SITE } from '@/config/links'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useBtcConnectors } from '@/hooks/useBtcConnectors'
import { LoginType } from '@/types/common'
import { openUrl } from '@/utils/getAssetsUrl'
import { setLocalStorage } from '@/utils/storage'

import WalletItem from './WalletItem'

type BtcConnectorsProps = {
  onClose: () => void
  expectedChainId?: number
}

const BtcConnectors: React.FC<BtcConnectorsProps> = ({
  onClose,
  expectedChainId
}) => {
  const { connect } = useConnect()
  const {
    okxWithParticleConnector: okxConnector,
    unisatConnector,
    bybitWithParticleConnector: bybitConnector,
    bitgetWithParticleConnector: bitgetConnector,
    xverseWithParticleConnector: xverseConnector
  } = useBtcConnectors()
  const { connect: connectParticle } = useConnector()

  const [loginType, setLoginType] = useState<LoginType>()

  const { evmAccount: particleEvmAccount, provider: particleEvmProvider } =
    useETHProvider()

  const connector = useMemo(() => {
    switch (loginType) {
      case LoginType.OKX:
        return okxConnector
      case LoginType.UNISAT:
        return unisatConnector
      case LoginType.BYBIT:
        return bybitConnector
      case LoginType.BITGET:
        return bitgetConnector
      case LoginType.XVERSE:
        return xverseConnector
      default:
        return undefined
    }
  }, [
    bitgetConnector,
    bybitConnector,
    loginType,
    okxConnector,
    unisatConnector,
    xverseConnector
  ])

  useEffect(() => {
    if (!loginType || !particleEvmAccount || !particleEvmProvider || !connector)
      return

    connect(
      { connector, chainId: expectedChainId },
      { onError: (v) => console.log('connect error: ', v) }
    )
    setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, loginType)
    onClose()
  }, [
    connect,
    connector,
    loginType,
    onClose,
    expectedChainId,
    particleEvmAccount,
    particleEvmProvider
  ])

  return (
    <>
      <WalletItem
        iconName="okx"
        name="OKX"
        connect={() => {
          if (!window.okxwallet) {
            openUrl(WALLET_SITE.okx)
            return
          }

          connectParticle(LoginType.OKX)
          setLoginType(LoginType.OKX)
        }}
      />
      <WalletItem
        iconName="unisat"
        name="Unisat"
        connect={async () => {
          if (!window.unisat) {
            openUrl(WALLET_SITE.unisat)
            return
          }

          connectParticle(LoginType.UNISAT)
          setLoginType(LoginType.UNISAT)
        }}
      />
      <WalletItem
        iconName="bybit"
        name="Bybit"
        connect={async () => {
          if (!window.bybitWallet) {
            openUrl(WALLET_SITE.bybit)
            return
          }

          connectParticle(LoginType.BYBIT)
          setLoginType(LoginType.BYBIT)
        }}
      />
      <WalletItem
        iconName="bitget"
        name="Bitget"
        connect={async () => {
          if (!window.bitgetWallet) {
            openUrl(WALLET_SITE.bitget)
            return
          }

          connectParticle(LoginType.BITGET)
          setLoginType(LoginType.BITGET)
        }}
      />
      <WalletItem
        iconName="xverse"
        name="Xverse"
        connect={async () => {
          if (!window.XverseProviders) {
            openUrl(WALLET_SITE.xverse)
            return
          }
          connectParticle(LoginType.XVERSE)
          setLoginType(LoginType.XVERSE)
        }}
      />
    </>
  )
}

export default BtcConnectors
