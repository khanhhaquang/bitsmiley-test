import { useWallet } from '@suiet/wallet-kit'
import { useMemo } from 'react'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { openUrl } from '@/utils/getAssetsUrl'
import { setLocalStorage } from '@/utils/storage'

import WalletItem from './WalletItem'

type SuiConnectorProps = {
  onClose: () => void
}

const SuiConnectors: React.FC<SuiConnectorProps> = ({ onClose }) => {
  const { select, configuredWallets, detectedWallets } = useWallet()

  const wallets = useMemo(
    () => [...configuredWallets, ...detectedWallets],
    [configuredWallets, detectedWallets]
  )

  return (
    <>
      {wallets?.map((wallet) => {
        return (
          <WalletItem
            key={wallet.name}
            iconSrc={wallet.iconUrl}
            name={wallet.name}
            connect={() => {
              if (!wallet.installed) {
                openUrl(wallet.downloadUrl.browserExtension ?? '')
                return
              }

              select(wallet.name)
                .then(() => {
                  setLocalStorage(
                    LOCAL_STORAGE_KEYS.LOGIN_TYPE,
                    `${wallet.name.toLowerCase()}_sui`
                  )
                  onClose()
                })
                .catch((v) => console.log('connect error: ', v))
            }}
          />
        )
      })}
    </>
  )
}

export default SuiConnectors
