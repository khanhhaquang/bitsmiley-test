import { cn } from '@/utils/cn'

export const ActionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, disabled, ...rest }) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        'text-nowrap border border-white/50 bg-white/10 px-4 py-1 font-ibmb text-sm text-white/70 shadow-[0_0_5px_1px_rgba(255,255,255,0.12)] hover:bg-white/20 hover:text-white active:bg-white/5 active:text-white/50',
        'cursor-pointer',
        'disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...rest}
    />
  )
}

export const InputSuffixActionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ disabled, onClick, className, ...rest }) => {
  return (
    <ActionButton
      onClick={(e) => !disabled && onClick?.(e)}
      className={cn(
        'w-[42px] border-blue/50 bg-blue/10 p-0 font-ibmr text-blue cursor-default hover:bg-blue/10 hover:text-blue active:text-blue active:bg-blue/10',
        disabled &&
          'border-white/20 bg-white/5 text-white/20 shadow-none hover:text-white/20 hover:bg-white/5 active:text-white/20 active:bg-white/5',
        !disabled && 'hover:bg-black/50 hover:text-blue cursor-pointer',
        className
      )}
      {...rest}
    />
  )
}
