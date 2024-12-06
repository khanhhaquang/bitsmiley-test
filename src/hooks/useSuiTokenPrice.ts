import { bcs } from '@mysten/sui/bcs'
import { Transaction } from '@mysten/sui/transactions'
import { fromHex } from '@mysten/sui/utils'
import { useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getSuiChainConfig } from '@/utils/chain'
import { parseFromMist } from '@/utils/sui'

import { useContractAddresses } from './useContractAddresses'
import { useSuiExecute } from './useSuiExecute'

export const useSuiTokenPrice = (collateralId: string = '') => {
  const { fetchTransactionResult } = useSuiExecute()
  const { chain, address } = useWallet()
  const { suiContractAddresses } = useContractAddresses(
    getSuiChainConfig(chain?.id)?.id
  )

  const PackageIds = useMemo(() => suiContractAddresses, [suiContractAddresses])

  const getTokenPrice = async (injectedCollateralId: string = '') => {
    if (!PackageIds) return undefined

    const tx = new Transaction()
    tx.moveCall({
      target: `${PackageIds.oraclePackageId}::simple_oracle::get_price`,
      arguments: [
        tx.object(PackageIds.oracleObjectId),
        tx.pure.vector('u8', fromHex(injectedCollateralId || collateralId))
      ]
    })

    const res = await fetchTransactionResult(tx)
    if (!res || res?.length === 0) return '0'
    return bcs.U256.parse(new Uint8Array(res))
  }

  const {
    data: priceAsMist,
    refetch,
    isFetching
  } = useQuery({
    queryKey: [
      'sui-token-price',
      suiContractAddresses?.oraclePackageId,
      suiContractAddresses?.oracleObjectId,
      address
    ],
    queryFn: () => getTokenPrice(),
    enabled: !!(
      address &&
      suiContractAddresses?.oraclePackageId &&
      suiContractAddresses?.oracleObjectId &&
      collateralId
    )
  })

  return {
    price: Number(parseFromMist(priceAsMist ?? 0)),
    priceAsMist,
    refetch,
    isFetching,
    getTokenPrice
  }
}
