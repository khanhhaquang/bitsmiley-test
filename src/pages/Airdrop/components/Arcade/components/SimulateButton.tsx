import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const SimulateButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, disabled, ...rest }) => {
  return (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        'w-[168px] h-[56px] uppercase text-black/75 text-base font-ibmb pb-2 group relative',
        className
      )}
      style={{
        textShadow: '1.186px 1.186px 0px rgba(0, 0, 0, 0.25)'
      }}
      {...rest}>
      <span className="relative z-10 mt-[18px] hidden h-full text-center group-hover:block group-active:block">
        Simulate
      </span>
      <img
        src={getIllustrationUrl('simulate-button', 'gif')}
        className="absolute inset-0 block h-[56px] w-[168px] group-hover:hidden group-active:hidden"
      />
      <img
        className={cn(
          'absolute top-3 left-[2px] h-[45px] w-[165px] hidden group-hover:hidden group-active:block'
        )}
        alt="button bg"
        src={getIllustrationUrl(`arcade-red-button-bg-active`, 'webp')}
      />
      <img
        className={cn(
          'absolute top-3 left-[2px] h-[45px] w-[165px] hidden group-active:hidden group-hover:block'
        )}
        alt="button bg"
        src={getIllustrationUrl(`arcade-red-button-bg-hover`, 'webp')}
      />
    </button>
  )
}
