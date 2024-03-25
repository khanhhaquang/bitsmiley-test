import { ReactNode } from 'react'

import { Image } from '@/components/Image'
import { InfoIndicator } from '@/components/InfoIndicator'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const BitPointBoardContainer: React.FC<{
  title: string
  children: ReactNode
  titleMessage?: string
  titleClassName?: string
  containerClassName?: string
}> = ({
  children,
  title,
  titleMessage,
  containerClassName,
  titleClassName
}) => {
  return (
    <div
      className={cn(
        'relative w-[346px] shrink-0 border bg-black/50 p-2',
        containerClassName
      )}>
      <div
        className={cn(
          '[text-shadow:1.5px_0_0_rgba(0,0,0,0.25)] flex items-center justify-center py-1.5 font-smb text-xs text-black gap-x-0.5 relative z-10 mb-6',
          titleClassName
        )}>
        {title}

        <InfoIndicator
          triggerClassName="[text-shadow:1.5px_0_0_rgba(0,0,0,0.25)]"
          message={titleMessage}
        />

        <Image
          className="absolute left-0 top-0 size-full"
          src={getIllustrationUrl('bitpoint-board-title-bg')}
        />
      </div>

      <div className="flex flex-col gap-y-3">{children}</div>
    </div>
  )
}
