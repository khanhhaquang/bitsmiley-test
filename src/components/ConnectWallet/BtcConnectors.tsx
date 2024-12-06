import { useConnector, useETHProvider } from '@particle-network/btc-connectkit'
import { useEffect, useMemo, useState } from 'react'
import { useConnect } from 'wagmi'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useBtcConnectors } from '@/hooks/useBtcConnectors'
import { LoginType } from '@/types/common'
import { openUrl } from '@/utils/getAssetsUrl'
import { setLocalStorage } from '@/utils/storage'

import WalletItem from './WalletItem'

type BtcConnectorsProps = {
  onClose: () => void
  expectedChainId?: number
  whitelistWallets?: string[]
}

const BtcConnectors: React.FC<BtcConnectorsProps> = ({
  onClose,
  expectedChainId,
  whitelistWallets = []
}) => {
  const { connect: connectEvm } = useConnect()
  const { connect: connectParticle, connectors } = useConnector()

  const {
    okxWithParticleConnector: okxConnector,
    unisatConnector,
    bybitWithParticleConnector: bybitConnector,
    bitgetWithParticleConnector: bitgetConnector,
    xverseWithParticleConnector: xverseConnector
  } = useBtcConnectors()

  const [loginType, setLoginType] = useState('')

  const { account: particleEvmAccount, provider: particleEvmProvider } =
    useETHProvider()

  const filteredConnectors = useMemo(() => {
    const newConnectors = connectors.filter((c) => c.metadata.id !== 'orange')

    if (whitelistWallets.length === 0) return newConnectors

    return newConnectors.filter((c) => whitelistWallets.includes(c.metadata.id))
  }, [connectors, whitelistWallets])

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

    connectEvm(
      { connector, chainId: expectedChainId },
      { onError: (v) => console.log('connect error: ', v) }
    )
    setLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE, loginType)
    onClose()
  }, [
    connectEvm,
    connector,
    loginType,
    onClose,
    expectedChainId,
    particleEvmAccount,
    particleEvmProvider
  ])

  return (
    <>
      {filteredConnectors.map((c) => (
        <WalletItem
          key={c.metadata.id}
          iconName={c.metadata.id}
          name={c.metadata.id}
          connect={async () => {
            if (c.isReady()) {
              try {
                await connectParticle(c.metadata.id)
                setLoginType(c.metadata.id)
              } catch (error: unknown) {
                console.error('BTC connect error: ', error)
              }
            } else {
              openUrl(c.metadata.downloadUrl)
            }
          }}
        />
      ))}
    </>
  )
}

export default BtcConnectors
