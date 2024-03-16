export const formatNumberWithSeparator = (value: number | bigint | string) => {
  if (isNaN(Number(value))) return 'NaN'

  return Intl.NumberFormat('en-GB', {
    style: 'decimal'
  }).format(Number(value))
}

export const formatNumberAsCompact = (
  value: number | bigint | string,
  config: {
    maximumFractionDigits?: number
    maximumSignificantDigits?: number
  } = {
    maximumFractionDigits: 3,
    maximumSignificantDigits: 2
  }
) => {
  if (isNaN(Number(value))) return 'NaN'

  return Intl.NumberFormat('en', {
    maximumFractionDigits: config?.maximumFractionDigits,
    maximumSignificantDigits: config?.maximumSignificantDigits,
    notation: 'compact'
  }).format(Number(value))
}
