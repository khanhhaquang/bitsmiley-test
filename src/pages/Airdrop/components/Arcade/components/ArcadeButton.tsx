import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

type Colors = 'green'

type ArcadeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: Colors
}

const BtnStyle: Record<Colors, [string, string]> = {
  green: ['arcade-green-button-bg', 'text-black']
} as const

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  className,
  color = 'green',
  disabled,
  ...rest
}) => {
  const [bgImage, textStyle] = BtnStyle[`${color}`]
  return (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        'w-[151px] h-[25px] uppercase text-white/80 text-sm',
        className,
        textStyle
      )}
      style={{
        backgroundImage: `url(${getIllustrationUrl(bgImage, 'webp')})`
      }}
      {...rest}
    />
  )
}
