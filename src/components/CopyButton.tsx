import { useState } from 'react'

import { CopyIcon } from '@/assets/icons'
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
    <button
      onClick={(e) => {
        e.stopPropagation()
        handleCopy()
      }}>
      <CopyIcon
        className={cn(
          'cursor-pointer text-white hover:text-white/70',
          className
        )}
      />
    </button>
  )
}
