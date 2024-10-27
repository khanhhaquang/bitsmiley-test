import { FC, useState } from 'react'

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
  onInputChange?: (v: number) => void
}

const Slider: FC<SliderProps> = ({
  min = 0,
  max = 100,
  range,
  className,
  stepsClassName,
  onInputChange
}) => {
  const [value, setValue] = useState(min)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target?.valueAsNumber
    setValue(value)
    onInputChange?.(value)
  }

  return (
    <div className={cn('flex flex-col gap-y-2', className)}>
      <div className="relative w-full">
        <div
          className="absolute h-[18px] max-w-full border-2 border-l-4 border-[#758CFF] bg-blue bg-repeat mix-blend-hard-light"
          style={{
            width: `${Math.floor((value / max) * 100)}%`,
            backgroundImage: `url(${getIllustrationUrl(
              'stake-slider-track-bg',
              'webp'
            )})`
          }}
        />
        <input
          value={value}
          type="range"
          onChange={onChange}
          min={min}
          max={max}
          className={cn(
            'flex-1 text-2xl bg-transparent text-white',
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
