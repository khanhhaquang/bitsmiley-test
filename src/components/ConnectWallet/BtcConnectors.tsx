import { useConnector, useETHProvider } from '@particle-network/btc-connectkit'
import { useEffect, useMemo, useState } from 'react'
import { useConnect } from 'wagmi'

import { WALLET_SITE } from '@/config/links'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useEvmConnectors } from '@/hooks/useEvmConnectors'
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
  const { okxWithParticleConnector: okxConnector, unisatConnector } =
    useEvmConnectors()
  const { connect: connectParticle } = useConnector()

  const [loginType, setLoginType] = useState<LoginType>()

  const { evmAccount: particleEvmAccount, provider: particleEvmProvider } =
    useETHProvider()

  const connector = useMemo(() => {
    if (loginType === LoginType.OKX) return okxConnector
    if (loginType === LoginType.UNISAT) return unisatConnector
    return undefined
  }, [loginType, okxConnector, unisatConnector])

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
    </>
  )
}

export default BtcConnectors
