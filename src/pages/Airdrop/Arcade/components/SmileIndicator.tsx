import { FC, ReactNode } from 'react'

import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const SmileIndicator: FC<{
  className?: string
  children?: ReactNode
}> = ({ children, className }) => {
  return (
    <span
      className={cn(
        'w-[151px] h-[25px] uppercase text-white/80 text-sm flex items-center justify-center',
        className
      )}
      style={{
        backgroundImage: `url(${getIllustrationUrl('blue-button-bg', 'webp')})`,
        backgroundSize: '100% 100%'
      }}>
      {children}
    </span>
  )
}
