import { bcs } from '@mysten/sui/bcs'
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { useSuiClient, useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { Address, hexToBytes } from 'viem'

import { getSuiChainConfig } from '@/utils/chain'
import { parseFromMist } from '@/utils/sui'

import { useContractAddresses } from './useContractAddresses'

export const useSuiTokenPrice = (collateralId?: Address) => {
  const suiClient = useSuiClient() as SuiClient
  const { account, chain } = useWallet()
  const { suiContractAddresses } = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )

  const getTokenPrice = async (
    owner: Address,
    packageId: Address,
    oracleObjectId: Address,
    collateralId: Address
  ) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${packageId}::simple_oracle::get_price`,
      arguments: [
        tx.object(oracleObjectId),
        tx.pure.vector('u8', hexToBytes(collateralId))
      ]
    })

    const res = await suiClient.devInspectTransactionBlock({
      sender: owner,
      transactionBlock: tx
    })

    const bytes = res.results?.[0].returnValues?.[0]?.[0] || []
    if (bytes.length === 0) return ''
    return bcs.U256.parse(new Uint8Array(bytes))
  }

  const {
    data: price,
    refetch,
    isFetching
  } = useQuery({
    queryKey: [
      'sui-token-price',
      suiContractAddresses?.oraclePackageId,
      suiContractAddresses?.oracleObjectId,
      account?.address,
      collateralId
    ],
    queryFn: () =>
      getTokenPrice(
        account?.address as Address,
        suiContractAddresses?.oraclePackageId as Address,
        suiContractAddresses?.oracleObjectId as Address,
        collateralId as Address
      ),
    enabled: Boolean(
      suiContractAddresses?.oraclePackageId &&
        suiContractAddresses?.oracleObjectId &&
        suiClient &&
        collateralId
    ),
    select: (data) => parseFromMist(data || '')
  })

  return {
    price: Number(price) || 0,
    refetch,
    isFetching
  }
}
