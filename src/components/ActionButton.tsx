import { cn } from '@/utils/cn'

export const ActionButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, disabled, ...rest }) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        'cursor-pointer',
        'text-nowrap border border-white/50 bg-white/10 px-4 py-1 font-ibmb text-sm text-white/70 shadow-[0_0_5px_1px_rgba(255,255,255,0.12)] hover:bg-white/20 hover:text-white active:bg-white/5 active:text-white/50',
        'disabled:bg-white/10 disabled:text-white/20  disabled:cursor-not-allowed',
        className
      )}
      {...rest}
    />
  )
}

export default ActionButton
