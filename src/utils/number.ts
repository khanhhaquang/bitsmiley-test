export const formatNumberWithSeparator = (
  value: number | bigint | string,
  maximumFractionDigits: number = 2
) => {
  if (isNaN(Number(value))) return 'NaN'

  return Intl.NumberFormat('en-GB', {
    maximumFractionDigits: maximumFractionDigits,
    style: 'decimal',
    roundingMode: 'trunc'
  }).format(Number(value))
}

export const formatNumberAsCompact = (
  value: number | bigint | string,
  maximumFractionDigits: number = 2
) => {
  if (isNaN(Number(value))) return 'NaN'

  return Intl.NumberFormat('en', {
    maximumFractionDigits: maximumFractionDigits,
    notation: 'compact',
    roundingMode: 'trunc'
  })
    .format(Number(value))
    .toLowerCase()
}