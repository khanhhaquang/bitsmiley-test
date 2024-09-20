import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount, useSignTypedData } from 'wagmi'
import { BitSmileyCalldataGenerator, ZetaBtcClient } from 'zeta-btc-client'

import { ZetaService } from '@/services/zeta'
import { isZetaChain } from '@/utils/chain'
import { btcToSats } from '@/utils/formatter'

import { useNativeBtcProvider } from './useNativeBtcProvider'
import { useProjectInfo } from './useProjectInfo'

export interface VerifyInfo {
  user: Address
  chainId: number
  signature: string
}

export const useZetaClient = (chain: number, collateralId: string) => {
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

  const signData = useCallback(
    (onSuccessCallback: () => void) => {
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
              onSuccessCallback()
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

  const tapRootAddress = useMemo(() => {
    if (callData && zetaConnectorAddress) {
      return zetaClient.call(zetaConnectorAddress, Buffer.from(callData, 'hex'))
    }
  }, [callData, zetaConnectorAddress, zetaClient])

  const handleSendBtc = useCallback(
    async (amount: number) => {
      try {
        if (tapRootAddress) {
          const satsAmount = btcToSats(amount)
          const result = await sendBitcoin(
            tapRootAddress.toString(),
            satsAmount
          )
          console.log('🚀 ~ btc commit txn:', result)
          return result
        }
      } catch (error) {
        console.log('🚀 ~ sendBtc error:', error)
      }
    },
    [sendBitcoin, tapRootAddress]
  )

  const handleRevealTxn = useCallback(
    async (
      commitTxn: string,
      commitAmount: number,
      onSuccess: (hash: string) => void
    ) => {
      if (zetaConnectorAddress && callData) {
        // const feesRecommended = await MempoolService.getRecommendedFees.call()
        console.log('buildRevealTxn:', commitTxn, commitAmount)
        const buffer = zetaClient.buildRevealTxn(
          { txn: commitTxn, idx: 0 },
          commitAmount,
          2 //feesRecommended.data.economyFee
        )
        const rawTx = Buffer.from(buffer).toString('hex')
        console.log('rawTx:', rawTx)
        //push result
        try {
          const txid = await pushTx(rawTx)
          console.log('txid:', txid)
          const intervalId = setInterval(() => {
            ZetaService.inboundHashToCctx
              .call(txid)
              .then((res) => {
                if (res?.data?.inboundHashToCctx.inbound_hash) {
                  clearInterval(intervalId)
                  onSuccess(res?.data?.inboundHashToCctx.inbound_hash)
                } else {
                  console.log('waiting txn inbound_hash')
                }
              })
              .catch(() => {
                console.log('waiting txn')
              })
          }, 1000)
        } catch (e) {
          console.log(e)
        }
      }
    },
    [callData, pushTx, zetaClient, zetaConnectorAddress]
  )

  return {
    signData,
    isZeta,
    btcAddress: btcAccounts[0],
    tapRootAddress,
    handleSendBtc,
    handleRevealTxn
  }
}
