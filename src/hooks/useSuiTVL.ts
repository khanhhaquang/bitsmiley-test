import { bcs } from '@mysten/sui/bcs'
import { Transaction } from '@mysten/sui/transactions'
import { useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'

import { getSuiChainConfig } from '@/utils/chain'
import { formatNumberAsCompact } from '@/utils/number'
import { parseFromMist } from '@/utils/sui'

import { useContractAddresses } from './useContractAddresses'
import { useSuiCollaterals } from './useSuiCollaterals'
import { useSuiExecute } from './useSuiExecute'
import { useSuiToken } from './useSuiToken'
import { useSuiTokenPrice } from './useSuiTokenPrice'

// wBtc * price + bitusd
export const useSuiTVL = () => {
  const { account, chain } = useWallet()
  const { suiContractAddresses } = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )

  const { collaterals } = useSuiCollaterals()
  const collateral = collaterals?.[0]
  const bitUSDType = `${suiContractAddresses?.bitUSDPackageId}::bitusd::BITUSD`

  const { price: btcPrice } = useSuiTokenPrice(collateral?.collateralId)

  const { coinMetadata: collateralMetaData } = useSuiToken(
    collateral?.collateral?.tokenAddress
  )
  const { coinMetadata: bitUSDMetaData } = useSuiToken(bitUSDType)
  const { fetchTransactionResult } = useSuiExecute()

  const collateralDecimals = collateralMetaData?.decimals ?? 0
  const bitUSDDecimals = bitUSDMetaData?.decimals ?? 0

  const getTotalBusd = async (
    packageId: Address,
    bitSmileyObjectId: Address
  ) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${packageId}::bitsmiley::balance_of_bitusd`,
      arguments: [tx.object(bitSmileyObjectId)]
    })

    const bytes = await fetchTransactionResult(tx)
    if (!bytes || bytes.length === 0) return '0'
    return bcs.U64.parse(new Uint8Array(bytes))
  }

  const { data: bitusd, isLoading: isLoadingBitUSD } = useQuery({
    queryKey: [
      'total_busd',
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId
    ],
    queryFn: () =>
      getTotalBusd(
        suiContractAddresses?.bitSmileyPackageId as Address,
        suiContractAddresses?.bitSmileyObjectId as Address
      ),
    enabled: !!(
      account?.address &&
      suiContractAddresses?.bitSmileyPackageId &&
      suiContractAddresses?.bitSmileyObjectId
    )
  })

  const getTotalWBTC = async (
    packageId: Address,
    bitSmileyObjectId: Address,
    tokenAddress: Address
  ) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${packageId}::bitsmiley::total_collateral`,
      arguments: [tx.object(bitSmileyObjectId)],
      typeArguments: [tokenAddress]
    })

    const bytes = await fetchTransactionResult(tx)

    if (!bytes || bytes.length === 0) return '0'
    return bcs.U64.parse(new Uint8Array(bytes))
  }
  const { data: wBtcBalance, isLoading: isLoadingWBTC } = useQuery({
    queryKey: [
      'total_wbtc',
      suiContractAddresses?.bitSmileyPackageId,
      suiContractAddresses?.bitSmileyObjectId,
      collateral?.collateral?.tokenAddress
    ],
    queryFn: () =>
      getTotalWBTC(
        suiContractAddresses?.bitSmileyPackageId as Address,
        suiContractAddresses?.bitSmileyObjectId as Address,
        collateral?.collateral?.tokenAddress as Address
      ),
    enabled: !!(
      account?.address &&
      suiContractAddresses?.bitSmileyPackageId &&
      suiContractAddresses?.bitSmileyObjectId &&
      collateral?.collateral?.tokenAddress
    )
  })

  const suiTVL = useMemo(() => {
    if (!btcPrice || !wBtcBalance || !bitusd) return 0n
    return (
      btcPrice *
        Number(parseFromMist(BigInt(wBtcBalance), collateralDecimals)) +
      Number(parseFromMist(BigInt(bitusd), bitUSDDecimals))
    )
  }, [btcPrice, wBtcBalance, bitusd, collateralDecimals, bitUSDDecimals])

  const isFetching = isLoadingBitUSD || isLoadingWBTC

  const suiFormatedTvl = useMemo(
    () => (isFetching ? '--' : formatNumberAsCompact(suiTVL)),
    [isFetching, suiTVL]
  )

  return { isFetching, suiTVL, suiFormatedTvl }
}
