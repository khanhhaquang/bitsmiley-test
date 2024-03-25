import { useState } from 'react'

import { CopyIcon } from '@/assets/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/utils/cn'
import { copyToClipboard } from '@/utils/copy'

type TProps = {
  text?: string | null
  className?: string
}

let timer: NodeJS.Timeout
export const CopyButton: React.FC<TProps> = ({ text, className }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!text) return

    copyToClipboard(text, () => {
      if (copied) {
        clearTimeout(timer)
      } else {
        setCopied(true)
      }

      timer = setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  if (!text) return null

  return (
    <Tooltip delayDuration={100} open={copied}>
      <TooltipTrigger className="z-10 cursor-pointer">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}>
          <CopyIcon
            className={cn(
              'cursor-pointer text-white hover:text-white/70 size-4',
              className
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>Copied!</TooltipContent>
    </Tooltip>
  )
}
