import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const SmileButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, disabled, ...rest }) => {
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
