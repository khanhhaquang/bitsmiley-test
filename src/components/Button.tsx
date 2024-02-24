import { cn } from '@/utils/cn'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'xs'
}

export const Button: React.FC<ButtonProps> = ({
  className,
  size = 'sm',
  ...rest
}) => {
  const smClassName =
    'text-[15px] px-5 py-2 active:translate-x-1.5 active:translate-y-1.5'
  const xsClassName =
    'text-sm px-3 py-1 active:translate-x-[3px] active:translate-y-[3px]'

  return (
    <button
      type="button"
      className={cn(
        'relative cursor-pointer font-bold whitespace-nowrap',
        'flex items-center justify-center',
        'text-black',
        'bg-white hover:bg-blue3 active:bg-blue',
        'shadow-connectwallet-button hover:shadow-connectwallet-button-hover active:shadow-none',
        size === 'xs' ? xsClassName : smClassName,
        className
      )}
      {...rest}
    />
  )
}
