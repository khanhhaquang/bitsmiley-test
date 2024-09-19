import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { BitSmileyCalldataGenerator, ZetaBtcClient } from 'zeta-btc-client'

import { isZetaChain } from '@/utils/chain'

import { useProjectInfo } from './useProjectInfo'

export interface VerifyInfo {
  user: Address
  chainId: number
  signature: string
}

export const useZetaClient = (chain: number, collateralId: string) => {
  const { address: evmAddress } = useAccount()
  const { accounts, sendBitcoin } = useBTCProvider()
  const { projectInfo } = useProjectInfo()

  const isZeta = useMemo(() => isZetaChain(chain), [chain])

  const zetaClient = useMemo(() => ZetaBtcClient.testnet(), [])

  const {
    data: signature,
    isPending: isSigning,
    signTypedData
  } = useSignTypedData()

  const contractAddresses = useMemo(
    () => projectInfo?.web3Info.find((w) => w.chainId === chain)?.contract,
    [chain, projectInfo?.web3Info]
  )
  const zetaConnectorAddress = useMemo(() => {
    return contractAddresses?.bitsmileyZetaConnector
  }, [contractAddresses])

  const signatureUtilAddress = useMemo(() => {
    return contractAddresses?.signatureUtil
  }, [contractAddresses])

  const signData = useCallback(() => {
    if (!isSigning && !signature && evmAddress && signatureUtilAddress) {
      const message = { user: evmAddress, chainId: BigInt(chain) }
      const domain = {
        name: 'bitsmiley.io',
        version: 'v0.0.1',
        verifyingContract: signatureUtilAddress,
        chainId: chain
      }
      signTypedData({
        domain,
        types: {
          VerifyInfo: [
            {
              name: 'user',
              type: 'address'
            },
            {
              name: 'chainId',
              type: 'uint256'
            }
          ]
        },
        primaryType: 'VerifyInfo',
        message
      })
    }
  }, [
    isSigning,
    signature,
    evmAddress,
    signatureUtilAddress,
    chain,
    signTypedData
  ])

  const tapRootAddress = useMemo(() => {
    if (
      zetaConnectorAddress &&
      evmAddress &&
      signatureUtilAddress &&
      signature
    ) {
      const callDataInstance = new BitSmileyCalldataGenerator(
        zetaConnectorAddress
      )

      const callData = callDataInstance.openVault(
        collateralId,
        '0',
        evmAddress,
        signature
      )

      return zetaClient.call(zetaConnectorAddress, Buffer.from(callData, 'hex'))
    }
  }, [
    zetaConnectorAddress,
    evmAddress,
    signatureUtilAddress,
    signature,
    collateralId,
    zetaClient
  ])

  const handleSendBtc = useCallback(
    async (amount: number) => {
      if (tapRootAddress) {
        //TODO: convert amount of btc to sats value
        const satsAmount = amount
        const result = await sendBitcoin(tapRootAddress.toString(), satsAmount)
        console.log('🚀 ~ result send:', result)
      }
    },
    [sendBitcoin, tapRootAddress]
  )

  return {
    signData,
    isZeta,
    btcAddress: accounts[0],
    tapRootAddress,
    handleSendBtc
  }
}
