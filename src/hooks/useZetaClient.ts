import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { BitSmileyCalldataGenerator, ZetaBtcClient } from 'zeta-btc-client'

import { isZetaChain } from '@/utils/chain'

import { useProjectInfo } from './useProjectInfo'

export const useZetaClient = (chain: number, collateralId: string) => {
  const { address: evmAddress } = useAccount()
  const { accounts, sendBitcoin } = useBTCProvider()
  const { projectInfo } = useProjectInfo()

  const isZeta = useMemo(() => isZetaChain(chain), [chain])

  const zetaConnectorAddress = useMemo(() => {
    const contractAddresses = projectInfo?.web3Info.find(
      (w) => w.chainId === chain
    )?.contract
    return contractAddresses?.bitsmileyZetaConnector
  }, [chain, projectInfo?.web3Info])

  const tapRootAddress = useMemo(() => {
    if (zetaConnectorAddress && evmAddress) {
      const callDataInstance = new BitSmileyCalldataGenerator(
        zetaConnectorAddress
      )

      const callData = callDataInstance.openVault(
        collateralId,
        '0',
        evmAddress,
        'temporary signature'
      )

      const zetaClient = ZetaBtcClient.testnet
      const tapRoot = zetaClient().call(
        evmAddress,
        Buffer.from(callData, 'hex')
      )
      return tapRoot
    }
  }, [zetaConnectorAddress, evmAddress, collateralId])

  return {
    isZeta,
    btcAddress: accounts[0],
    tapRootAddress,
    sendBitcoin
  }
}
