import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { BitSmileyCalldataGenerator, ZetaBtcClient } from 'zeta-btc-client'

import { isZetaChain } from '@/utils/chain'
import { btcToSats } from '@/utils/formatter'

import { useBtcFee } from './useBtcFee'
import { useNativeBtcProvider } from './useNativeBtcProvider'
import { useProjectInfo } from './useProjectInfo'

export interface VerifyInfo {
  user: Address
  chainId: number
  signature: string
}

export const useZetaClient = (chain: number, collateralId: string) => {
  const { recommendedFee } = useBtcFee()
  const { address: evmAddress } = useAccount()
  const { accounts: btcAccounts, sendBitcoin, pushTx } = useNativeBtcProvider()
  const { projectInfo } = useProjectInfo()

  const isZeta = useMemo(() => isZetaChain(chain), [chain])

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

  const zetaClient = useMemo(() => ZetaBtcClient.testnet(), [])

  const callDataInstance = useMemo(
    () =>
      zetaConnectorAddress
        ? new BitSmileyCalldataGenerator(zetaConnectorAddress)
        : undefined,
    [zetaConnectorAddress]
  )

  const callData = useMemo(() => {
    if (callDataInstance && evmAddress && signature) {
      const callData = callDataInstance.openVault(
        collateralId,
        '0',
        evmAddress,
        signature
      )
      return callData
    }

    return null
  }, [callDataInstance, collateralId, evmAddress, signature])

  const tapRootAddress = useMemo(() => {
    if (callData && zetaConnectorAddress) {
      return zetaClient.call(zetaConnectorAddress, Buffer.from(callData, 'hex'))
    }
  }, [callData, zetaConnectorAddress, zetaClient])

  const signData = useCallback(
    (onSuccessCallback?: () => void) => {
      if (!isSigning && !signature && evmAddress && signatureUtilAddress) {
        const message = { user: evmAddress, chainId: BigInt(chain) }
        const domain = {
          name: 'bitsmiley.io',
          version: 'v0.0.1',
          verifyingContract: signatureUtilAddress,
          chainId: chain
        }
        signTypedData(
          {
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
          },
          {
            onSuccess: () => {
              onSuccessCallback?.()
            }
          }
        )
      }
    },
    [
      isSigning,
      signature,
      evmAddress,
      signatureUtilAddress,
      chain,
      signTypedData
    ]
  )

  const broadcastTxn = useCallback(
    async (rawTx: string) => {
      try {
        const btcTxn = await pushTx(rawTx)
        console.log('btcTxn:', btcTxn)
        return btcTxn ?? ''
      } catch (error) {
        console.log('🚀 ~ broadcastTxn ~ error:', error)
        return ''
      }
    },
    [pushTx]
  )

  const handleSendBtc = useCallback(
    async (amount: number) => {
      try {
        if (tapRootAddress) {
          const satsAmount = btcToSats(amount)
          const commitTxn = await sendBitcoin(
            tapRootAddress.toString(),
            satsAmount
          )
          console.log('🚀 ~ btc commit txn:', commitTxn)
          const buffer = zetaClient.buildRevealTxn(
            { txn: commitTxn, idx: 0 },
            satsAmount,
            recommendedFee?.halfHourFee || 2
          )
          const rawTx = buffer.toString('hex')
          console.log('rawTx:', rawTx)
          return rawTx
        }
      } catch (error) {
        console.log('🚀 ~ sendBtc error:', error)
        return ''
      }
    },
    [tapRootAddress, sendBitcoin, zetaClient, recommendedFee?.halfHourFee]
  )

  return {
    signData,
    isZeta,
    btcAddress: btcAccounts[0],
    tapRootAddress,
    handleSendBtc,
    broadcastTxn
  }
}
