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

import { suiMainnet } from '@/config/wagmi'
import { useProjectInfo } from '@/hooks/useProjectInfo'

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
  const { suiChains } = useProjectInfo()
  // Config options for the networks you want to connect to
  const SupportedChains: Chain[] = [
    suiChains?.[0].chainId === suiMainnet.id ? SuiMainnetChain : SuiTestnetChain
  ]

  return (
    <WalletProvider
      defaultWallets={[SuietWallet, SuiWallet, stashedWalletConfig]}
      chains={SupportedChains}>
      {children}
    </WalletProvider>
  )
}

export default SuiProvider
