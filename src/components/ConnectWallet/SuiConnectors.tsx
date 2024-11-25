import { useConnectWallet, useWallets } from '@mysten/dapp-kit'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { setLocalStorage } from '@/utils/storage'

import WalletItem from './WalletItem'

type SuiConnectorProps = {
  onClose: () => void
}

const SuiConnectors: React.FC<SuiConnectorProps> = ({ onClose }) => {
  const { mutate: connect } = useConnectWallet()
  const wallets = useWallets()

  return (
    <>
      {wallets?.map((item) => {
        const walletName = item?.name?.split(' ')?.[0] || ''
        const loginType = `${walletName.toUpperCase()}_SUI`
        return (
          <WalletItem
            iconSrc={item?.icon}
            name={walletName}
            connect={() => {
              connect(
                { wallet: item },
                {
                  onSuccess: () => {
                    if (Object.keys(LoginType).includes(loginType)) {
                      setLocalStorage(
                        LOCAL_STORAGE_KEYS.LOGIN_TYPE,
                        LoginType[
                          loginType as unknown as keyof typeof LoginType
                        ]
                      )
                    }
                    onClose()
                  }
                }
              )
            }}
          />
        )
      })}
    </>
  )
}

export default SuiConnectors
