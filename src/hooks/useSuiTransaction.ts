import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'
import { useWallet } from '@suiet/wallet-kit'
import { useCallback } from 'react'
import { Address, hexToBytes } from 'viem'

import { getSuiChainConfig } from '@/utils/chain'
import { convertToMist } from '@/utils/sui'

import { useContractAddresses } from './useContractAddresses'
import { useSuiCollaterals } from './useSuiCollaterals'
import { useSuiExecute } from './useSuiExecute'
import { useSuiToken } from './useSuiToken'
import { useSuiVaultAddress } from './useSuiVaultAddress'

export const useSuiTransaction = (collateralId: string) => {
  const { chain } = useWallet()
  const { suiContractAddresses } = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )
  const { validateTransaction, ...transactionState } = useSuiExecute()
  const { vaultAddress } = useSuiVaultAddress()
  const { collateral } = useSuiCollaterals(collateralId)

  const bitUSDType = `${suiContractAddresses?.bitUSDPackageId}::bitsmiley::BITSMILEY`
  const collateralTokenType = collateral?.collateral?.tokenAddress ?? ''

  const { coinId: collateralCoinId, coinMetadata: collateralMetaData } =
    useSuiToken(collateralTokenType)

  const { addCoinObject: addBitUSDCoinObject, coinMetadata: bitUSDMetaData } =
    useSuiToken(bitUSDType)

  const openAndMint = useCallback(
    (deposit: string, mint: string, collateralId: string) => {
      const tx = new Transaction()

      if (collateralCoinId) {
        const collateral = convertToMist(
          Number(deposit),
          collateralMetaData?.decimals ?? 0
        )
        const bitUSD = convertToMist(
          Number(mint),
          bitUSDMetaData?.decimals ?? 0
        )

        tx.moveCall({
          target: `${suiContractAddresses?.bitSmileyPackageId}::bitsmiley::open_vault`,
          typeArguments: [collateralTokenType],
          arguments: [
            tx.object(
              suiContractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(collateralCoinId),
            tx.pure.vector('u8', hexToBytes(collateralId as Address)),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })

        validateTransaction({ tx })
      }
    },
    [
      collateralCoinId,
      collateralMetaData?.decimals,
      bitUSDMetaData?.decimals,
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId,
      suiContractAddresses?.vaultManagerObjectId,
      suiContractAddresses?.stabilityFeeObjectId,
      suiContractAddresses?.oracleObjectId,
      collateralTokenType,
      validateTransaction
    ]
  )

  const mint = useCallback(
    (deposit: string, mint: string) => {
      const tx = new Transaction()
      if (collateralCoinId) {
        const collateral = convertToMist(
          Number(deposit),
          collateralMetaData?.decimals ?? 0
        )
        const bitUSD = convertToMist(
          Number(mint),
          bitUSDMetaData?.decimals ?? 0
        )
        tx.moveCall({
          target: `${suiContractAddresses?.bitSmileyPackageId}::bitsmiley::mint`,
          typeArguments: [collateralTokenType],
          arguments: [
            tx.object(
              suiContractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(collateralCoinId),
            tx.pure.address(vaultAddress as Address),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })
        validateTransaction({ tx })
      }
    },
    [
      collateralCoinId,
      collateralMetaData?.decimals,
      bitUSDMetaData?.decimals,
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId,
      suiContractAddresses?.vaultManagerObjectId,
      suiContractAddresses?.stabilityFeeObjectId,
      suiContractAddresses?.oracleObjectId,
      collateralTokenType,
      vaultAddress,
      validateTransaction
    ]
  )

  const repay = useCallback(
    (deposit: string, mint: string) => {
      const tx = new Transaction()

      const collateral = convertToMist(
        Number(deposit),
        collateralMetaData?.decimals ?? 0
      )
      const bitUSD = convertToMist(Number(mint), bitUSDMetaData?.decimals ?? 0)

      const bitUSDCoins = addBitUSDCoinObject(tx)
      const bitUSDId = bitUSDCoins?.coinObjectId
      if (collateralCoinId && bitUSDId) {
        tx.moveCall({
          target: `${suiContractAddresses?.bitSmileyPackageId}::bitsmiley::repay`,
          typeArguments: [collateralTokenType],
          arguments: [
            tx.object(
              suiContractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(collateralCoinId),
            tx.object(bitUSDId),
            tx.pure.address(vaultAddress as Address),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })
        validateTransaction({ tx })
      }
    },
    [
      collateralMetaData?.decimals,
      bitUSDMetaData?.decimals,
      addBitUSDCoinObject,
      collateralCoinId,
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId,
      suiContractAddresses?.vaultManagerObjectId,
      suiContractAddresses?.stabilityFeeObjectId,
      suiContractAddresses?.oracleObjectId,
      collateralTokenType,
      vaultAddress,
      validateTransaction
    ]
  )

  const repayAll = useCallback(
    (deposit: string) => {
      const tx = new Transaction()
      const collateral = convertToMist(Number(deposit))

      const bitUSDCoins = addBitUSDCoinObject(tx)
      const bitUSDId = bitUSDCoins?.coinObjectId
      if (collateralCoinId && bitUSDId) {
        tx.moveCall({
          target: `${suiContractAddresses?.bitSmileyPackageId}::bitsmiley::repay_all`,
          typeArguments: [collateralTokenType],
          arguments: [
            tx.object(
              suiContractAddresses?.bitSmileyObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.vaultManagerObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.stabilityFeeObjectId as TransactionObjectInput
            ),
            tx.object(
              suiContractAddresses?.oracleObjectId as TransactionObjectInput
            ),
            tx.object(collateralCoinId),
            tx.object(bitUSDId),
            tx.pure.address(vaultAddress as Address),
            tx.pure.u64(collateral),
            tx.object.clock()
          ]
        })
        validateTransaction({ tx })
      }
    },
    [
      addBitUSDCoinObject,
      collateralCoinId,
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId,
      suiContractAddresses?.vaultManagerObjectId,
      suiContractAddresses?.stabilityFeeObjectId,
      suiContractAddresses?.oracleObjectId,
      collateralTokenType,
      vaultAddress,
      validateTransaction
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
