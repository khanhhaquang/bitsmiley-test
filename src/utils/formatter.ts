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

export const formatMoney = (num = 0) => {
  num = num.toString()
  const index = num.indexOf('.')
  const l = num.split('.')[0].split('').reverse()
  let r = ''
  if (index !== -1) {
    r = num.split('.')[1]
  }
  let t = ''
  let D = null
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
  }
  D = t.split('').reverse().join('')
  if (index !== -1) {
    D = D + '.' + r
  }
  return D
}
export const formatDecimal = (num, decimal = 2) => {
  num = num.toString()
  const index = num.indexOf('.')
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1)
  } else {
    num = num.substring(0)
  }
  const endData = parseFloat(num).toFixed(decimal)
  let newstr = endData
  const leng = endData.length - endData.indexOf('.') - 1
  if (endData.indexOf('.') > -1) {
    for (let i = leng; i > 0; i--) {
      if (
        newstr.lastIndexOf('0') > -1 &&
        newstr.substr(newstr.length - 1, 1) == 0
      ) {
        const k = newstr.lastIndexOf('0')
        if (newstr.charAt(k - 1) == '.') {
          return newstr.substring(0, k - 1)
        } else {
          newstr = newstr.substring(0, k)
        }
      } else {
        return newstr
      }
    }
  }
  return endData
}

export const getBtcScanUrl = (txid: string) => {
  return `https://mempool.space/tx/${txid}`
}

export const getOrdScanUrl = (inscriptionId: string) => {
  return `https://ordinals.com/inscription/${inscriptionId}`
}
