import { useSuiCollaterals } from './useSuiCollaterals'
import { useSuiTokenPrice } from './useSuiTokenPrice'

export const useSuiBtcPrice = () => {
  const { collaterals } = useSuiCollaterals()

  const btcId = collaterals?.find((c) => c.name === 'BTC.BTC-A - bitusd')
    ?.collateralId

  return useSuiTokenPrice(btcId)
}
