import { SuiClient } from '@mysten/sui/client'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useCallback, useMemo } from 'react'
import { Address, hexToBytes } from 'viem'

import { getSuiChainConfig } from '@/utils/chain'
import { convertToMist } from '@/utils/sui'

import { useContractAddresses } from './useContractAddresses'
import { useSuiExecute } from './useSuiExecute'
import { useSuiTokenBalance } from './useSuiTokenBalance'
import { useSuiVaultAddress } from './useSuiVaultAddress'

export const useSuiTransaction = () => {
  const suiClient = useSuiClient() as SuiClient
  const { account, chain } = useWallet()
  const contractAddresses = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )
  const { validateTransaction, ...transactionState } = useSuiExecute()
  const { vaultAddress } = useSuiVaultAddress()

  const btcType = `${contractAddresses?.btcPackageId}::btc::BTC`
  const bitUSDType = `${contractAddresses?.bitUSDPackageId}::bitusd::BITUSD`

  const { coins: btcCoins } = useSuiTokenBalance(btcType)
  const { addCoinObject: addBitUSDCoinObject } = useSuiTokenBalance(bitUSDType)

  const btcCoinId = useMemo(() => btcCoins?.data?.[0]?.coinObjectId, [btcCoins])

  const openAndMint = useCallback(
    async (deposit: string, mint: string, collateralId: string) => {
      const tx = new Transaction()

      if (btcCoinId) {
        const collateral = convertToMist(Number(deposit))
        const bitUSD = convertToMist(Number(mint))

        tx.moveCall({
          target: `${contractAddresses?.bitSmileyPackageId}::bitsmiley::open_vault`,
          typeArguments: [btcType],
          arguments: [
            tx.object(
              contractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(btcCoinId),
            tx.pure.vector('u8', hexToBytes(collateralId as Address)),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })

        await validateTransaction({ tx })
      }
    },
    [contractAddresses, btcCoinId, btcType, suiClient, account?.address]
  )

  const mint = useCallback(
    async (deposit: string, mint: string) => {
      const tx = new Transaction()
      if (btcCoinId) {
        const collateral = convertToMist(Number(deposit))
        const bitUSD = convertToMist(Number(mint))
        tx.moveCall({
          target: `${contractAddresses?.bitSmileyPackageId}::bitsmiley::mint`,
          typeArguments: [btcType],
          arguments: [
            tx.object(
              contractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(btcCoinId),
            tx.pure.address(vaultAddress as Address),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })
        await validateTransaction({ tx })
      }
    },
    [
      contractAddresses,
      btcType,
      btcCoinId,
      suiClient,
      account?.address,
      vaultAddress
    ]
  )

  const repay = useCallback(
    async (deposit: string, mint: string) => {
      const tx = new Transaction()

      const collateral = convertToMist(Number(deposit))
      const bitUSD = convertToMist(Number(mint))

      const bitUSDCoins = addBitUSDCoinObject(tx)
      const bitUSDId = bitUSDCoins?.coinObjectId
      if (btcCoinId && bitUSDId) {
        tx.moveCall({
          target: `${contractAddresses?.bitSmileyPackageId}::bitsmiley::repay`,
          typeArguments: [btcType],
          arguments: [
            tx.object(
              contractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(btcCoinId),
            tx.object(bitUSDId),
            tx.pure.address(vaultAddress as Address),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })
        await validateTransaction({ tx })
      }
    },
    [
      contractAddresses,
      btcType,
      suiClient,
      bitUSDType,
      account?.address,
      vaultAddress,
      btcCoinId,
      addBitUSDCoinObject
    ]
  )

  const repayAll = useCallback(
    async (deposit: string) => {
      const tx = new Transaction()
      const collateral = convertToMist(Number(deposit))

      const bitUSDCoins = addBitUSDCoinObject(tx)
      const bitUSDId = bitUSDCoins?.coinObjectId
      if (btcCoinId && bitUSDId) {
        tx.moveCall({
          target: `${contractAddresses?.bitSmileyPackageId}::bitsmiley::repay_all`,
          typeArguments: [btcType],
          arguments: [
            tx.object(
              contractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              contractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(btcCoinId),
            tx.object(bitUSDId),
            tx.pure.address(vaultAddress as Address),
            tx.pure.u64(collateral),
            tx.object.clock()
          ]
        })
        await validateTransaction({ tx })
      }
    },
    [
      contractAddresses,
      btcType,
      suiClient,
      bitUSDType,
      account?.address,
      vaultAddress,
      btcCoinId,
      addBitUSDCoinObject
    ]
  )

  return {
    openAndMint,
    mint,
    repay,
    repayAll,
    transactionState
  }
}
