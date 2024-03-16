import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

export const InfoIndicator: React.FC<{
  message?: string
  className?: string
}> = ({ className, message }) => {
  if (!message) return null

  return (
    <Tooltip>
      <TooltipTrigger className="cursor-pointer">
        <span>ⓘ</span>
      </TooltipTrigger>
      <TooltipContent className={className}>{message}</TooltipContent>
    </Tooltip>
  )
}
