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

  const sign = useCallback(
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

  const openVault = useCallback(
    async (btcAmount: number, mint: string) => {
      try {
        if (evmAddress && callDataInstance && signature) {
          const callData = callDataInstance.openVault(
            collateralId,
            mint || '0',
            evmAddress,
            signature
          )
          console.log('🚀 ~ openVault callData:', callData)
          const satsAmount = btcToSats(btcAmount)
          const commitTxn = await sendBitcoin(
            zetaClient.call(Buffer.from(callData, 'hex')).toString(),
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
    [
      evmAddress,
      callDataInstance,
      signature,
      collateralId,
      sendBitcoin,
      zetaClient,
      recommendedFee?.halfHourFee
    ]
  )

  const mint = useCallback(
    async (btcAmount: number, mint: string) => {
      try {
        if (evmAddress && callDataInstance && signature) {
          const callData = callDataInstance.mint(
            evmAddress,
            mint || '0',
            signature
          )
          console.log('🚀 ~ mint callData:', callData)
          const satsAmount = btcToSats(btcAmount)
          const commitTxn = await sendBitcoin(
            zetaClient.call(Buffer.from(callData, 'hex')).toString(),
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
    [
      evmAddress,
      callDataInstance,
      signature,
      sendBitcoin,
      zetaClient,
      recommendedFee?.halfHourFee
    ]
  )

  return {
    sign,
    isZeta,
    btcAddress: btcAccounts[0],
    openVault,
    mint,
    broadcastTxn
  }
}
