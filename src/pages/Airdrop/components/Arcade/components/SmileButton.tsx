import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

// type SpecialButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
//   color?: 'red' | 'blue'
// }

export const SmileButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  // color = 'blue',
  className,
  disabled,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        'w-[151px] h-[25px] uppercase text-white/80 text-sm',
        className
      )}
      style={{
        backgroundImage: `url(${getIllustrationUrl('blue-button-bg', 'webp')})`
      }}
      {...rest}
    />
  )
}
