import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const BuyButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, disabled, ...rest }) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        'w-[144px] h-[47px] group relative cursor-pointer',
        'disabled:cursor-not-allowed disabled:saturate-50',
        className
      )}
      {...rest}>
      <span className="relative z-10 flex h-full items-center justify-center">
        {rest?.children}
      </span>
      <img
        className={cn('absolute inset-0 size-full block group-hover:hidden')}
        alt="button bg"
        src={getIllustrationUrl(`buy-button-bg`, 'webp')}
      />
      <img
        className={cn('absolute inset-0 size-full hidden group-hover:block')}
        alt="button bg"
        src={getIllustrationUrl(`buy-button-hover-bg`, 'webp')}
      />
    </button>
  )
}
