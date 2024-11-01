import { useMemo } from 'react'

import { axios } from '@/config/axios'
import { MempoolService } from '@/services/mempool'

import { useBtcNetwork } from './useBtcNetwork'

const MEMPOOL_TESTNET_URL = 'https://mempool.space/testnet/api'
const MEMPOOL_URL = 'https://mempool.space/api'

export const useMempool = () => {
  const { btcNetwork } = useBtcNetwork()

  const mempoolDomain = useMemo(() => {
    return btcNetwork === 'livenet' ? MEMPOOL_URL : MEMPOOL_TESTNET_URL
  }, [btcNetwork])

  const caller = useMemo(() => {
    return axios.create({
      baseURL: mempoolDomain
    })
  }, [mempoolDomain])

  const service = useMemo(() => MempoolService(caller), [caller])

  return service
}
