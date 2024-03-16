import { ReactNode, useState } from 'react'

import { InputIndicatorIcon } from '@/assets/icons'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export type NumberInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title: ReactNode
  titleSuffix?: ReactNode
  inputSuffix?: ReactNode
  disabled?: boolean
  greyOut?: boolean
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  disabled,
  greyOut,
  title,
  titleSuffix,
  inputSuffix,
  ...rest
}) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <div className="flex flex-col gap-y-1">
      <div className="relative flex items-center justify-between overflow-hidden bg-blue px-2 py-1.5 text-xs text-black">
        <div className="absolute inset-0 bg-bitUsdInputHeaderBg" />
        <span className="relative flex items-center gap-x-1 font-smb [text-shadow:1.5px_0_0_rgba(0,0,0,0.25)]">
          <InputIndicatorIcon className={cn('hidden', isFocus && 'block')} />
          {title}
        </span>
        <span className="relative font-ibmr font-bold">{titleSuffix}</span>
      </div>

      <div
        className={cn(
          'relative border border-blue bg-black/50 px-3 py-1',
          greyOut && 'bg-white/20'
        )}>
        <Input
          type="number"
          value={value}
          disabled={disabled}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
          placeholder={greyOut ? '--' : '0.00'}
          className={cn(
            'size-full border-0 p-0 font-ibmb text-base text-white/70 placeholder:text-white/20 focus:text-white',
            greyOut && 'placeholder:text-white/50 text-white/20'
          )}
          {...rest}
        />
        <div className="absolute right-1.5 top-1/2 flex h-full -translate-y-1/2 flex-col justify-center font-ibmr text-xs text-white/50">
          {inputSuffix}
        </div>
        <div className="absolute left-0 top-0 h-full w-[7px] bg-blue" />
      </div>
    </div>
  )
}
