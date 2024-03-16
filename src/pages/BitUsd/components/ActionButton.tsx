import { cn } from '@/utils/cn'

export const ActionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, ...rest }) => {
  return (
    <button
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
> = ({ className, ...rest }) => {
  return (
    <ActionButton
      className={cn(
        'w-[42px] border-blue/50 bg-blue/10 p-0 font-ibmr text-blue hover:bg-black/50 hover:text-blue',
        className
      )}
      {...rest}
    />
  )
}
