import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider
} from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { ReactNode } from 'react'

import { isProduction } from '@/utils/helpers'

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  sui: { url: getFullnodeUrl(isProduction() ? 'mainnet' : 'testnet') }
})

const SuiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="sui">
      <WalletProvider>{children}</WalletProvider>
    </SuiClientProvider>
  )
}

export default SuiProvider
