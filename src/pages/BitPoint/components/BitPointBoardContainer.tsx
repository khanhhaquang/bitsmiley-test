import { ReactNode } from 'react'

import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const BitPointBoardContainer: React.FC<{
  title: string
  children: ReactNode
  titleClassName?: string
  containerClassName?: string
}> = ({ children, title, containerClassName, titleClassName }) => {
  return (
    <div
      className={cn(
        'relative flex w-[346px] shrink-0 flex-col gap-y-6 border bg-black/50 p-2',
        containerClassName
      )}>
      <div
        className={cn(
          '[text-shadow:1.5px_0_0_rgba(0,0,0,0.25)] flex items-center justify-center py-1.5 font-smb text-xs text-black relative',
          titleClassName
        )}>
        {title}

        <Image
          className="absolute left-0 top-0 size-full"
          src={getIllustrationUrl('bitpoint-board-title-bg')}
        />
      </div>

      {children}
    </div>
  )
}
