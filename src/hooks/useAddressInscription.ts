import { MempoolService } from '@/services/mempool'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'
import { InscriptionParserService } from 'ordpool-parser'
import { useStoreActions } from './useStoreActions'
import imgString from './imgString.json'

export const useAddressInscription = () => {
  const { address } = useUserInfo()
  const { setTxId } = useStoreActions()

  const { data, isLoading, isRefetching } = useQuery(
    [MempoolService.getAddressTransactions.key, address],
    () =>
      MempoolService.getAddressTransactions.call(address).then((res) => {
        const txns = res.data
        if (!txns?.length) return null

        const targetTxn = txns
          .sort((a, b) => a.status.block_time - b.status.block_time)
          .find((t) => {
            const parsedInscriptions = InscriptionParserService.parse(t)
            const targetInscription = parsedInscriptions?.find(
              (i) =>
                i.getDataUri().toLowerCase() === imgString.base64.toLowerCase()
            )
            return !!targetInscription
          })

        if (targetTxn) {
          setTxId(targetTxn.txid)
        }

        return targetTxn
      }),
    {
      enabled: !!address
    }
  )

  return {
    txn: data,
    isLoading: isLoading && !isRefetching
  }
}
