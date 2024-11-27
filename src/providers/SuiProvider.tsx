import {
  Chain,
  defineStashedWallet,
  SuietWallet,
  SuiMainnetChain,
  SuiTestnetChain,
  SuiWallet,
  WalletProvider
} from '@suiet/wallet-kit'
import { ReactNode } from 'react'

import { isProduction } from '@/utils/helpers'

// Config options for the networks you want to connect to
const SupportedChains: Chain[] = [
  isProduction() ? SuiMainnetChain : SuiTestnetChain
]

const stashedWalletConfig = defineStashedWallet({
  appName: 'bitSmiley'
})

// const OkxWallet = defineWallet({
//   name: 'okx',
//   label: 'OKX',
//   iconUrl: getIllustrationUrl(`okx-wallet`, 'webp'),
//   downloadUrl: {
//     browserExtension: WALLET_SITE.okx
//   }
// })

const SuiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WalletProvider
      defaultWallets={[SuietWallet, SuiWallet, stashedWalletConfig]}
      chains={SupportedChains}>
      {children}
    </WalletProvider>
  )
}

export default SuiProvider
