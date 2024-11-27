import { SuiClient } from '@mysten/sui/client'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useCallback } from 'react'
import { Address, hexToBytes } from 'viem'

import { getSuiChainConfig } from '@/utils/chain'

import { useContractAddresses } from './useContractAddresses'
import { convertToMist, useSuiExecute } from './useSuiUtils'
import { useSuiVault } from './useSuiVault'

export const useSuiTransaction = () => {
  const suiClient = useSuiClient() as SuiClient
  const { account, chain } = useWallet()
  const contractAddresses = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )
  const { validateTransaction, ...transationState } = useSuiExecute()
  const { vaultAddress } = useSuiVault()

  const btcType = `${contractAddresses?.btcPackageId}::btc::BTC`
  const bitUSDType = `${contractAddresses?.bitUSDPackageId}::bitusd::BITUSD`

  const openAndMint = useCallback(
    async (deposit: string, mint: string, collateralId: string) => {
      const tx = new Transaction()

      const coins = await suiClient.getCoins({
        owner: account?.address as string,
        coinType: btcType
      })
      console.log(`>>> ${account?.address} btc balance:`, coins)
      if (coins?.data?.length >= 0) {
        const coinId = coins?.data?.[0]?.coinObjectId
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
            tx.object(coinId),
            tx.pure.vector('u8', hexToBytes(collateralId as Address)),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })

        await validateTransaction({ tx })
      }
    },
    [contractAddresses, btcType, suiClient, account?.address]
  )

  const mint = useCallback(
    async (mint: string) => {
      const tx = new Transaction()

      const coins = await suiClient.getCoins({
        owner: account?.address as string,
        coinType: btcType
      })
      console.log(`>>> ${account?.address} btc balance:`, coins)
      if (coins?.data?.length >= 0) {
        const coinId = coins?.data?.[0]?.coinObjectId

        const collateral = 0n
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
            tx.object(coinId),
            tx.pure.address(vaultAddress as Address),
            tx.pure.u64(collateral),
            tx.pure.u64(bitUSD),
            tx.object.clock()
          ]
        })
        await validateTransaction({ tx })
      }
    },
    [contractAddresses, btcType, suiClient, account?.address, vaultAddress]
  )

  const repay = useCallback(
    async (mint: string) => {
      const tx = new Transaction()

      const btcCoins = await suiClient.getCoins({
        owner: account?.address as string,
        coinType: btcType
      })
      console.log(`>>> ${account?.address} btc balance:`, btcCoins)

      const collateral = 0n
      const bitUSD = convertToMist(Number(mint))

      const bitUSDCoins = await suiClient.getCoins({
        owner: account?.address as string,
        coinType: bitUSDType
      })

      console.log(`>>> ${account?.address} bitUSD balance:`, bitUSDCoins)
      const bitUSDId = bitUSDCoins?.data?.find?.(
        (coin) => BigInt(coin?.balance) == bitUSD
      )?.coinObjectId
      console.log(`>>> ${account?.address} bitUSDId:`, bitUSDId)
      if (btcCoins?.data?.length >= 0 && bitUSDId) {
        const btcCoinId = btcCoins?.data?.[0]?.coinObjectId

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
      vaultAddress
    ]
  )

  const repayAll = useCallback(
    async (mint: string) => {
      const tx = new Transaction()

      const btcCoins = await suiClient.getCoins({
        owner: account?.address as string,
        coinType: btcType
      })
      console.log(`>>> ${account?.address} btc balance:`, btcCoins)

      const collateral = 0n
      const bitUSD = convertToMist(Number(mint))

      const bitUSDCoins = await suiClient.getCoins({
        owner: account?.address as string,
        coinType: bitUSDType
      })

      console.log(`>>> ${account?.address} bitUSD balance:`, bitUSDCoins)
      const bitUSDId = bitUSDCoins?.data?.find?.(
        (coin) => BigInt(coin?.balance) == bitUSD
      )?.coinObjectId
      console.log(`>>> ${account?.address} bitUSDId:`, bitUSDId)
      if (btcCoins?.data?.length >= 0 && bitUSDId) {
        const btcCoinId = btcCoins?.data?.[0]?.coinObjectId

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
      vaultAddress
    ]
  )

  return {
    openAndMint,
    mint,
    repay,
    repayAll,
    transationState
  }
}
