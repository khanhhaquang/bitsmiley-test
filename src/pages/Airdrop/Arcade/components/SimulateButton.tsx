import { useRive } from '@rive-app/react-canvas'

import { cn } from '@/utils/cn'

export const SimulateButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, disabled, ...rest }) => {
  const { RiveComponent: SimulateRive, rive: simulateBtnRive } = useRive({
    src: '/rive/simulate-button-interaction.riv',
    animations: disabled ? 'Timeline 6' : 'Timeline 3',
    autoplay: true
  })

  return (
    <button
      onMouseEnter={() => {
        simulateBtnRive?.stop('Timeline 3')
        simulateBtnRive?.play('Timeline 6')
        simulateBtnRive?.play('Timeline 4')
      }}
      onMouseDown={() => {
        simulateBtnRive?.stop('Timeline 4')
        simulateBtnRive?.play('Timeline 5')
      }}
      onMouseLeave={() => {
        simulateBtnRive?.stop('Timeline 4')
        simulateBtnRive?.stop('Timeline 5')
        simulateBtnRive?.play('Timeline 6')
      }}
      disabled={disabled}
      type="button"
      className={cn(
        'w-[168px] h-[56px] uppercase text-black/75 text-base font-ibmb pb-2 group cursor-pointer relative',
        'disabled:cursor-not-allowed disabled:saturate-50',
        className
      )}
      style={{
        textShadow: '1.186px 1.186px 0px rgba(0, 0, 0, 0.25)'
      }}
      {...rest}>
      <SimulateRive className="absolute left-1/2 top-1/2 aspect-[168/56] w-[176px] -translate-x-1/2 -translate-y-1/2" />
    </button>
  )
}
