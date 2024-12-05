import { bcs } from '@mysten/sui/bcs'
import { Transaction } from '@mysten/sui/transactions'
import { fromHex } from '@mysten/sui/utils'
import { useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'

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

  const getTokenPrice = async (
    packageId: string = '',
    oracleObjectId: string = ''
  ) => {
    const tx = new Transaction()
    tx.moveCall({
      target: `${packageId}::simple_oracle::get_price`,
      arguments: [
        tx.object(oracleObjectId),
        tx.pure.vector('u8', fromHex(collateralId))
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
    queryFn: () =>
      getTokenPrice(
        suiContractAddresses?.oraclePackageId,
        suiContractAddresses?.oracleObjectId
      ),
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
    isFetching
  }
}
