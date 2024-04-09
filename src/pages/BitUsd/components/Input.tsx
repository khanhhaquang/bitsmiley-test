import { InputHTMLAttributes, ReactNode } from 'react'

import { Input as BaseInput } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputSuffix?: ReactNode
  disabledMessage?: ReactNode
  errorMessage?: ReactNode
  greyOut?: boolean
}

const Input: React.FC<NumberInputProps> = ({
  disabled,
  greyOut,
  disabledMessage,
  errorMessage,
  ...rest
}) => {
  return (
    <div className="flex w-full flex-col items-start gap-y-1">
      <div
        className={cn(
          'relative border border-blue bg-black/50 px-3 py-1 h-9 w-full',
          greyOut && 'bg-white/10',
          disabled && 'bg-white/20 border-white/20'
        )}>
        <BaseInput
          disabled={disabled}
          placeholder={
            disabled && disabledMessage ? '' : disabled ? '--' : '0.00'
          }
          className={cn(
            'size-full border-0 p-0 font-ibmb text-base text-white/70 placeholder:text-white/20 focus:text-white bg-transparent outline-none',
            greyOut && 'placeholder:text-white/20 text-white/20',
            disabled && 'cursor-not-allowed'
          )}
          {...rest}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[7px] bg-blue',
            disabled && 'bg-white/20'
          )}
        />
      </div>

      {!!errorMessage && (
        <p className="w-full text-left font-ibmr text-sm text-error">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Input
