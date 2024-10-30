import { useRive } from '@rive-app/react-canvas'

import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const SimulateButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, disabled, ...rest }) => {
  const { RiveComponent: SimulateRive } = useRive({
    src: '/rive/simulate-button.riv',
    autoplay: true
  })

  // useEffect(() => {
  //   // simulateBtnRive?.setTextRunValue('simulate', 'xxx')
  // }, [simulateBtnRive])

  return (
    <button
      disabled={disabled}
      type="button"
      className={cn(
        'w-[168px] h-[56px] uppercase text-black/75 text-base font-ibmb pb-2 group relative cursor-pointer relative',
        'disabled:cursor-not-allowed',
        className
      )}
      style={{
        textShadow: '1.186px 1.186px 0px rgba(0, 0, 0, 0.25)'
      }}
      {...rest}>
      <span className="relative z-10 mt-[18px] hidden h-full text-center group-hover:block group-active:block">
        Simulate
      </span>
      <SimulateRive className="absolute left-1/2 top-1/2 aspect-[168/56] w-[176px] -translate-x-1/2 -translate-y-1/2 group-hover:hidden group-active:hidden" />
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
