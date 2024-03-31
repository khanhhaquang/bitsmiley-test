import { ReactNode, useState } from 'react'
import { IMaskInput } from 'react-imask'

import { InputIndicatorIcon } from '@/assets/icons'
import { cn } from '@/utils/cn'
import { formartNumberAsTrunc } from '@/utils/number'

export type NumberInputProps = {
  value?: string
  title: ReactNode
  scale?: number
  titleSuffix?: ReactNode
  inputSuffix?: ReactNode
  disabled?: boolean
  greyOut?: boolean
  onFocus?: () => void
  onBlur?: () => void
  onInputChange?: (v?: string) => void
  disabledMessage?: ReactNode
  message?: ReactNode
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  disabled,
  greyOut,
  title,
  scale = 2,
  titleSuffix,
  inputSuffix,
  onFocus,
  onBlur,
  onInputChange,
  disabledMessage,
  message
}) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <div className="flex flex-col gap-y-1">
      <div className="relative flex items-center justify-between overflow-hidden bg-blue px-2 py-1.5 text-xs text-white">
        <div className="absolute inset-0 bg-bitUsdInputHeaderBg" />
        <span className="relative flex items-center gap-x-1 font-smb [text-shadow:1.5px_0_0_rgba(0,0,0,0.25)]">
          <InputIndicatorIcon className={cn('hidden', isFocus && 'block')} />
          {title}
        </span>
        <span className="relative flex items-center font-ibmr font-bold text-white/70">
          {titleSuffix}
        </span>
      </div>

      <div
        className={cn(
          'relative border border-blue bg-black/50 px-3 py-1',
          greyOut && 'bg-white/10',
          disabled && 'bg-white/20 border-white/20'
        )}>
        <IMaskInput
          mask={Number}
          thousandsSeparator=","
          radix="."
          min={0}
          scale={scale}
          value={value}
          unmask="typed"
          onAccept={(_, mask) => {
            const rawValue = value
            const unMaskedValue = mask.unmaskedValue
            const truncatedRawValue = formartNumberAsTrunc(
              rawValue || '',
              scale
            )
            const rawValueprecision = rawValue?.split('.')?.[1]?.length || 0

            // when 1234.5678904567 is passed, do not change to 1234.56
            if (
              !!rawValueprecision &&
              rawValueprecision > scale &&
              unMaskedValue === truncatedRawValue
            ) {
              return
            }

            onInputChange?.(mask.unmaskedValue)
          }}
          disabled={disabled}
          onBlur={() => {
            setIsFocus(false)
            onBlur?.()
          }}
          onFocus={() => {
            setIsFocus(true)
            onFocus?.()
          }}
          placeholder={
            disabled && disabledMessage ? '' : disabled ? '--' : '0.00'
          }
          className={cn(
            'size-full border-0 p-0 font-ibmb text-base text-white/70 placeholder:text-white/20 focus:text-white bg-transparent outline-none',
            greyOut && 'placeholder:text-white/20 text-white/20',
            disabled && 'cursor-not-allowed'
          )}
        />
        {!disabled && (
          <div className="absolute right-1.5 top-1/2 flex h-full -translate-y-1/2 flex-col justify-center font-ibmr text-xs text-white/50">
            {inputSuffix}
          </div>
        )}
        {disabled && disabledMessage && (
          <div className="absolute left-3 top-0 font-ibmr text-xs text-white/50">
            {disabledMessage}
          </div>
        )}
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[7px] bg-blue',
            disabled && 'bg-white/20'
          )}
        />
      </div>

      <div className="font-ibmr text-xs font-bold">{message}</div>
    </div>
  )
}
