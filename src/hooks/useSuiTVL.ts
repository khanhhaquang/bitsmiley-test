import { bcs } from '@mysten/sui/bcs'
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'

import { getSuiChainConfig } from '@/utils/chain'
import { formatNumberAsCompact } from '@/utils/number'
import { parseFromMist } from '@/utils/sui'

import { useContractAddresses } from './useContractAddresses'
import { useSuiCollaterals } from './useSuiCollaterals'
import { useSuiTokenPrice } from './useSuiTokenPrice'

// wBtc * price + bitusd
export const useSuiTVL = () => {
  const { account, chain } = useWallet()
  const { suiContractAddresses } = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )
  const { collaterals } = useSuiCollaterals()
  const collateral = collaterals?.[0]
  const { price: btcPrice } = useSuiTokenPrice(
    collateral?.collateralId as Address
  )
  const suiClient = useSuiClient() as SuiClient

  const getTotalBusd = async (
    owner: Address,
    packageId: Address,
    bitSmileyObjectId: Address
  ) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${packageId}::bitsmiley::balance_of_bitusd`,
      arguments: [tx.object(bitSmileyObjectId)]
    })

    const res = await suiClient.devInspectTransactionBlock({
      sender: owner,
      transactionBlock: tx
    })

    const bytes = res.results?.[0].returnValues?.[0]?.[0] || []
    if (bytes.length === 0) return ''
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
        account?.address as Address,
        suiContractAddresses?.bitSmileyPackageId as Address,
        suiContractAddresses?.bitSmileyObjectId as Address
      ),
    enabled: !!(
      suiContractAddresses?.bitSmileyPackageId &&
      suiContractAddresses?.bitSmileyObjectId
    )
  })

  const getTotalWBTC = async (
    owner: Address,
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

    const res = await suiClient.devInspectTransactionBlock({
      sender: owner,
      transactionBlock: tx
    })

    const bytes = res.results?.[0].returnValues?.[0]?.[0] || []
    if (bytes.length === 0) return ''
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
        account?.address as Address,
        suiContractAddresses?.bitSmileyPackageId as Address,
        suiContractAddresses?.bitSmileyObjectId as Address,
        collateral?.collateral?.tokenAddress as Address
      ),
    enabled: !!(
      suiContractAddresses?.bitSmileyPackageId &&
      suiContractAddresses?.bitSmileyObjectId &&
      collateral?.collateral?.tokenAddress
    )
  })

  const suiTVL = useMemo(() => {
    if (!btcPrice || !wBtcBalance || !bitusd) return 0n
    return BigInt(
      btcPrice * parseFromMist(BigInt(wBtcBalance)) + parseFromMist(bitusd)
    )
  }, [btcPrice, wBtcBalance, bitusd])

  const isFetching = isLoadingBitUSD || isLoadingWBTC

  const suiFormatedTvl = useMemo(
    () => (isFetching ? '--' : formatNumberAsCompact(BigInt(suiTVL))),
    [isFetching, suiTVL]
  )

  return { isFetching, suiTVL, suiFormatedTvl }
}
