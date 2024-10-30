import { FC } from 'react'

import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import styles from './Slider.module.scss'

type SliderProps = {
  min?: number
  max?: number
  range?: number[]
  className?: string
  inputClassName?: string
  stepsClassName?: string
  step?: string | number
  disabled?: boolean
  value?: number
  onInputChange?: (v: number) => void
}

const Slider: FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  range,
  className,
  stepsClassName,
  disabled,
  value = 0,
  onInputChange
}) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target?.valueAsNumber
    onInputChange?.(value)
  }

  return (
    <div className={cn('flex flex-col gap-y-2', className)}>
      <div className="relative w-full">
        <div
          className="absolute h-[18px] max-w-full border-x-4 border-y-2 border-[#758CFF] bg-blue bg-repeat mix-blend-hard-light"
          style={{
            width: `${Math.floor((value / max) * 100)}%`,
            backgroundImage: `url(${getIllustrationUrl(
              'stake-slider-track-bg',
              'webp'
            )})`
          }}
        />
        <input
          disabled={disabled}
          value={value}
          type="range"
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className={cn(
            'flex-1 text-2xl bg-transparent text-white w-full h-[18px] disabled:cursor-not-allowed',
            styles.sliderInput
          )}
        />
      </div>
      <p
        className={cn(
          'flex items-center justify-between text-base text-white',
          stepsClassName
        )}>
        {(range || [0, 25, 50, 75, 100]).map((tick) => (
          <span key={tick}>{tick}%</span>
        ))}
      </p>
    </div>
  )
}

export default Slider
