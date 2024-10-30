import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/utils/cn'

export const InfoIndicator: React.FC<{
  message?: string
  className?: string
  triggerClassName?: string
}> = ({ className, message, triggerClassName }) => {
  if (!message) return null

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger className={cn('z-10 cursor-pointer', triggerClassName)}>
        <span>ⓘ</span>
      </TooltipTrigger>
      <TooltipContent className={className}>{message}</TooltipContent>
    </Tooltip>
  )
}
