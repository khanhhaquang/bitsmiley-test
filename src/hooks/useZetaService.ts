import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { axios } from '@/config/axios'
import { ZetaService } from '@/services/zeta'

const ZETA_MAINNET_API = 'https://zetachain.blockpi.network/lcd/v1/public'
const ZETA_TESTNET_API =
  'https://zetachain-athens.blockpi.network/lcd/v1/public'

export const useZetaService = () => {
  const { chain } = useAccount()

  const apiUrl = useMemo(() => {
    return chain && chain?.testnet ? ZETA_TESTNET_API : ZETA_MAINNET_API
  }, [chain])

  const caller = useMemo(() => {
    return axios.create({
      baseURL: apiUrl
    })
  }, [apiUrl])

  const service = useMemo(() => ZetaService(caller), [caller])

  return service
}
