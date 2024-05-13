import { ReactNode } from 'react'

import {
  MachineTitleLeftWhiteIcon,
  MachineTitleRightWhiteIcon,
  MachineTitleLeftBlueIcon,
  MachineTitleRightBlueIcon
} from '@/assets/icons'
import { cn } from '@/utils/cn'

export const VaultTitleBlue: React.FC<{
  className?: string
  children: ReactNode
}> = ({ children, className }) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-3">
      <MachineTitleLeftBlueIcon className="h-5 flex-1" />
      <span
        className={cn(
          'flex shrink-0 items-center font-smb text-2xl text-blue [text-shadow:-2px_0_0_#FF64AE]',
          className
        )}>
        {children}
      </span>
      <MachineTitleRightBlueIcon className="h-5 flex-1" />
    </div>
  )
}

export const VaultTitleWhite: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-3">
      <MachineTitleLeftWhiteIcon className="h-5 flex-1" />
      <span className="shrink-0 font-smb text-2xl">{children}</span>
      <MachineTitleRightWhiteIcon className="h-5 flex-1" />
    </div>
  )
}
