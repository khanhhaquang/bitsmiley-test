import { useState } from 'react'

import { cn } from '@/utils/cn'
import { CopyIcon } from '@/assets/icons'
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
          'cursor-pointer text-green hover:text-green/70',
          className
        )}
      />
    </button>
  )
}
