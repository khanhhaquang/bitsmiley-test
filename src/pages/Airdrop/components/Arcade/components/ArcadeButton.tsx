import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

type Colors = 'green' | 'red'

type ArcadeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Colors
}

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  className,
  color = 'green',
  disabled,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        'w-[151px] h-[25px] uppercase text-black/75 text-base font-ibmb pb-2 group relative',
        className
      )}
      style={{
        textShadow: '1.186px 1.186px 0px rgba(0, 0, 0, 0.25)'
      }}
      {...rest}>
      <span className="flex items-center justify-center z-10 relative h-full">
        {rest?.children}
      </span>
      <img
        className={cn(
          'absolute inset-0 size-full block group-active:hidden group-hover:hidden'
        )}
        alt="button bg"
        src={getIllustrationUrl(`arcade-${color}-button-bg`, 'webp')}
      />
      <img
        className={cn(
          'absolute inset-0 size-full hidden group-hover:hidden group-active:block'
        )}
        alt="button bg"
        src={getIllustrationUrl(`arcade-${color}-button-bg-active`, 'webp')}
      />
      <img
        className={cn(
          'absolute inset-0 size-full hidden group-active:hidden group-hover:block'
        )}
        alt="button bg"
        src={getIllustrationUrl(`arcade-${color}-button-bg-hover`, 'webp')}
      />
    </button>
  )
}
