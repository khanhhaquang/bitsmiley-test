export const formatNumberWithSeparator = (
  value: number | bigint | string,
  minimumFractionDigits: number = 4
) => {
  if (isNaN(Number(value))) return 'NaN'

  const val = Intl.NumberFormat('en-GB', {
    minimumFractionDigits: minimumFractionDigits + 1,
    style: 'decimal'
  }).format(Number(value))

  const newVal = val
    .split('')
    .filter((_, index) => index !== val.length - 1)
    .join('')

  return newVal
}

export const formatNumberAsCompact = (
  value: number | bigint | string,
  minimumFractionDigits: number = 4
) => {
  if (isNaN(Number(value))) return 'NaN'

  const val = Intl.NumberFormat('en', {
    minimumFractionDigits: minimumFractionDigits + 1,
    notation: 'compact'
  }).format(Number(value))

  const newVal = val
    .split('')
    .filter((_, index) => index !== val.length - 2)
    .join('')

  return newVal
}
