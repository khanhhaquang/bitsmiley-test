import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useQuery } from '@tanstack/react-query'

export const useBtcNetwork = () => {
  const { accounts, getNetwork } = useBTCProvider()

  const { data: btcNetwork, refetch: getNetworkRefetch } = useQuery({
    queryKey: ['btc-connected-network', accounts[0]],
    queryFn: () => getNetwork()
  })

  return {
    btcNetwork,
    getNetworkRefetch
  }
}
