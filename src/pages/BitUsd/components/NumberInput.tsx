import { ReactNode, useRef, useState } from 'react'
import { IMaskInput } from 'react-imask'

import { InputIndicatorIcon } from '@/assets/icons'
import { cn } from '@/utils/cn'

export type NumberInputProps = {
  value?: string
  title: ReactNode
  titleSuffix?: ReactNode
  inputSuffix?: ReactNode
  disabled?: boolean
  greyOut?: boolean
  onFocus?: () => void
  onBlur?: () => void
  onInputChange?: (v?: string) => void
  disabledMessage?: string
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  disabled,
  greyOut,
  title,
  titleSuffix,
  inputSuffix,
  onFocus,
  onBlur,
  onInputChange,
  disabledMessage
}) => {
  const [isFocus, setIsFocus] = useState(false)

  const ref = useRef(null)
  const inputRef = useRef(null)

  return (
    <div className="flex flex-col gap-y-1">
      <div className="relative flex items-center justify-between overflow-hidden bg-blue px-2 py-1.5 text-xs text-black">
        <div className="absolute inset-0 bg-bitUsdInputHeaderBg" />
        <span className="relative flex items-center gap-x-1 font-smb [text-shadow:1.5px_0_0_rgba(0,0,0,0.25)]">
          <InputIndicatorIcon
            className={cn('hidden text-black', isFocus && 'block')}
          />
          {title}
        </span>
        <span className="relative font-ibmr font-bold">{titleSuffix}</span>
      </div>

      <div
        className={cn(
          'relative border border-blue bg-black/50 px-3 py-1',
          greyOut && 'bg-white/20',
          disabled && 'bg-white/10'
        )}>
        <IMaskInput
          ref={ref}
          mask={Number}
          thousandsSeparator=","
          radix="."
          min={0}
          scale={20}
          value={value}
          unmask="typed"
          inputRef={inputRef}
          onAccept={(_, mask) => onInputChange?.(mask.unmaskedValue)}
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
            disabled && disabledMessage ? '' : greyOut ? '--' : '0.00'
          }
          className={cn(
            'size-full border-0 p-0 font-ibmb text-base text-white/70 placeholder:text-white/20 focus:text-white bg-transparent outline-none',
            greyOut && 'placeholder:text-white/50 text-white/20',
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
        <div className="absolute left-0 top-0 h-full w-[7px] bg-blue" />
      </div>
    </div>
  )
}