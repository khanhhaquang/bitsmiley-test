import {
  MachineTitleLeftWhiteIcon,
  MachineTitleRightWhiteIcon
} from '@/assets/icons'
import { cn } from '@/utils/cn'

export const BitPointTitle: React.FC<{ title: string; className?: string }> = ({
  title,
  className
}) => {
  return (
    <div
      className={cn(
        'mb-8 flex w-full items-center justify-center gap-x-1.5',
        className
      )}>
      <MachineTitleLeftWhiteIcon className="h-5 flex-1" />
      <span className="shrink-0 text-nowrap font-smb text-2xl [text-shadow:-2px_0_0_rgba(255,255,255,0.45)]">
        {title}
      </span>
      <MachineTitleRightWhiteIcon className="h-5 flex-1" />
    </div>
  )
}
