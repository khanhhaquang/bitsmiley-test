import { InputHTMLAttributes, ReactNode } from 'react'

import { Input as BaseInput } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export type NumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  inputSuffix?: ReactNode
  disabledMessage?: ReactNode
  errorMessage?: ReactNode
  greyOut?: boolean
  inputClassName?: string
}

const StyledInput: React.FC<NumberInputProps> = ({
  className,
  inputClassName,
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
          'relative border border-blue border-l-[18px] bg-black/50 pl-3 pr-1.5 py-1',
          greyOut && 'bg-white/10',
          disabled && 'bg-white/20 border-white/20',
          className
        )}>
        <BaseInput
          disabled={disabled}
          placeholder={
            disabled && disabledMessage ? '' : disabled ? '--' : '0.00'
          }
          className={cn(
            'size-full border-0 p-0 text-white/70 placeholder:text-white/20 focus:text-white bg-transparent outline-none',
            'text-2xl font-ibmb',
            greyOut && 'placeholder:text-white/20 text-white/20',
            disabled && 'cursor-not-allowed',
            inputClassName
          )}
          {...rest}
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

export default StyledInput
