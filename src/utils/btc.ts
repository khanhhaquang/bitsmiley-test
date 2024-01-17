const OUTPUT_VALUE = 546
export function estimateUnisatFee(data: {
  address: string
  fileSize: number
  fileCount: number
  contentTypeSize: number
  feeRate: number
  feeFileSize: number
  devFee: number
  serviceFee: boolean
}) {
  const feeFileCount = 25 // do not change this
  const address = data.address // the receiver address
  const inscriptionBalance = OUTPUT_VALUE // the balance in each inscription
  const fileCount = data.fileCount // the fileCount
  const fileSize = data.fileSize // the total size of all files
  const contentTypeSize = data.contentTypeSize // the size of contentType
  const feeRate = data.feeRate // the feeRate
  const feeFileSize = data.fileSize // the total size of first 25 files
  const devFee = data.devFee // the fee for developer

  const balance = inscriptionBalance * fileCount

  let addrSize = 25 + 1 // p2pkh
  if (address.indexOf('bc1q') == 0 || address.indexOf('tb1q') == 0) {
    addrSize = 22 + 1
  } else if (address.indexOf('bc1p') == 0 || address.indexOf('tb1p') == 0) {
    addrSize = 34 + 1
  } else if (address.indexOf('2') == 0 || address.indexOf('3') == 0) {
    addrSize = 23 + 1
  }

  const baseSize = 88
  let networkSats = Math.ceil(
    ((fileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
      feeRate
  )
  if (fileCount > 1) {
    networkSats = Math.ceil(
      ((fileSize + contentTypeSize) / 4 +
        (baseSize +
          8 +
          addrSize +
          (35 + 8) * (fileCount - 1) +
          8 +
          23 +
          (baseSize + 8 + addrSize + 0.5) * (fileCount - 1))) *
        feeRate
    )
  }
  let networkSatsByFeeCount = Math.ceil(
    ((feeFileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
      feeRate
  )
  if (fileCount > 1) {
    networkSatsByFeeCount = Math.ceil(
      ((feeFileSize + contentTypeSize * (feeFileCount / fileCount)) / 4 +
        (baseSize +
          8 +
          addrSize +
          (35 + 8) * (fileCount - 1) +
          8 +
          23 +
          (baseSize + 8 + addrSize + 0.5) *
            Math.min(fileCount - 1, feeFileCount - 1))) *
        feeRate
    )
  }

  const baseFee = 1999 * Math.min(fileCount, feeFileCount) // 1999 base fee for top 25 files
  const floatFee = Math.ceil(networkSatsByFeeCount * 0.0499) // 4.99% extra miner fee for top 25 transations
  const serviceFee = data.serviceFee ? Math.floor(baseFee + floatFee) : 0

  const total = balance + networkSats + serviceFee
  const truncatedTotal = Math.floor(total / 1000) * 1000 // truncate
  const amount = truncatedTotal + devFee // add devFee at the end

  return amount
}
