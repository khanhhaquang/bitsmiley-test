export const displayAddress = (
  address = '',
  startOffset = 4,
  endOffset = 4
): string => {
  if (!address) return '--'

  const lowerAddress = address.toLowerCase()

  return (
    lowerAddress.slice(0, startOffset) + '...' + lowerAddress.slice(-endOffset)
  )
}

const SATS_BTC_CONVERSION = 100000000 // 100,000,000

export const satsToBTC = (sats: number) => {
  if (!sats) return 0
  if (typeof sats === 'number') return sats / SATS_BTC_CONVERSION
  return Number(sats) / SATS_BTC_CONVERSION
}

export const btcToSats = (btc: number) => {
  if (typeof btc === 'number') return btc * SATS_BTC_CONVERSION
  return Number(btc) * SATS_BTC_CONVERSION
}
