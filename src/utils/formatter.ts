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

export const getBtcScanUrl = (txid: string) => {
  if (import.meta.env.PROD) {
    return `https://mempool.space/tx/${txid}`
  }
  return `https://mempool.space/testnet/tx/${txid}`
}
