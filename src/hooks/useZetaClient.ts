import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import {
  BitSmileyCalldataGenerator,
  NETWORK,
  ZetaBtcClient
} from 'zeta-btc-client'

import { isZetaChain } from '@/utils/chain'
import { btcToSats } from '@/utils/formatter'

import { useBtcFee } from './useBtcFee'
import { useBtcNetwork } from './useBtcNetwork'
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
  const { evmChains } = useProjectInfo()
  const { btcNetwork } = useBtcNetwork()

  const btcAddress = useMemo(() => btcAccounts[0], [btcAccounts])
  const isZeta = useMemo(() => isZetaChain(chain), [chain])

  const {
    data: signature,
    isPending: isSigning,
    signTypedData
  } = useSignTypedData()

  const contractAddresses = useMemo(
    () => evmChains?.find((w) => w.chainId === chain)?.contract,
    [chain, evmChains]
  )
  const zetaConnectorAddress = useMemo(() => {
    return contractAddresses?.bitsmileyZetaConnector
  }, [contractAddresses])

  const signatureUtilAddress = useMemo(() => {
    return contractAddresses?.signatureUtil
  }, [contractAddresses])

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
            {
              revertAddress: btcAddress
            },
            {
              bitusd: mint || '0',
              ownerAddress: evmAddress,
              collateralId,
              signature
            }
          )

          console.log('🚀 ~ openVault callData:', callData)
          const satsAmount = btcToSats(btcAmount)
          const memo = Buffer.from(callData, 'hex')
          const feeRate = recommendedFee?.fastestFee || 2
          const network =
            btcNetwork === 'livenet' ? NETWORK.mainnet : NETWORK.testnet

          const fee = ZetaBtcClient.estimateRevealTxnFee(
            network,
            memo,
            satsAmount,
            feeRate
          )

          console.log('🚀 ~ estimated fee:', fee)

          const total = satsAmount + fee

          const zetaClient =
            btcNetwork === 'livenet'
              ? ZetaBtcClient.mainnet()
              : ZetaBtcClient.testnet()

          const commitTxn = await sendBitcoin(
            zetaClient.call(memo).toString(),
            total
          )
          console.log('🚀 ~ btc commit txn:', commitTxn)

          const buffer = zetaClient.buildRevealTxn(
            { txn: commitTxn, idx: 0 },
            total,
            feeRate
          )
          const rawTx = buffer.toString('hex')
          console.log('🚀 ~ rawTx:', rawTx)
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
      btcAddress,
      collateralId,
      recommendedFee?.fastestFee,
      btcNetwork,
      sendBitcoin
    ]
  )

  const mint = useCallback(
    async (btcAmount: number, mint: string) => {
      try {
        if (evmAddress && callDataInstance && signature) {
          const callData = callDataInstance.mint(
            {
              revertAddress: btcAddress
            },
            {
              ownerAddress: evmAddress,
              bitusd: mint || '0',
              signature
            }
          )
          console.log('🚀 ~ mint callData:', callData)
          const satsAmount = btcToSats(btcAmount)
          const memo = Buffer.from(callData, 'hex')
          const feeRate = recommendedFee?.fastestFee || 2
          const network =
            btcNetwork === 'livenet' ? NETWORK.mainnet : NETWORK.testnet

          const fee = ZetaBtcClient.estimateRevealTxnFee(
            network,
            memo,
            satsAmount,
            feeRate
          )
          console.log('🚀 ~ estimated fee:', fee)

          const total = satsAmount + fee

          const zetaClient =
            btcNetwork === 'livenet'
              ? ZetaBtcClient.mainnet()
              : ZetaBtcClient.testnet()

          const commitTxn = await sendBitcoin(
            zetaClient.call(memo).toString(),
            total
          )
          console.log('🚀 ~ btc commit txn:', commitTxn)
          const buffer = zetaClient.buildRevealTxn(
            { txn: commitTxn, idx: 0 },
            total,
            feeRate
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
      btcAddress,
      recommendedFee?.fastestFee,
      btcNetwork,
      sendBitcoin
    ]
  )

  return {
    sign,
    isZeta,
    btcAddress,
    openVault,
    mint,
    broadcastTxn
  }
}
