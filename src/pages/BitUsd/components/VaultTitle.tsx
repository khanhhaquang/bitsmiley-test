import { ReactNode } from 'react'

import {
  MintingPairsTitleLeftIcon,
  MintingPairsTitleRightIcon,
  MyVaultsPairsTitleLeftIcon,
  MyVaultsPairsTitleRightIcon
} from '@/assets/icons'

export const VaultTitleBlue: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-3">
      <MyVaultsPairsTitleLeftIcon className="w-full flex-1" />
      <span className="font-smb text-2xl text-blue [text-shadow:-2px_0_0_#FF64AE]">
        {children}
      </span>
      <MyVaultsPairsTitleRightIcon className="w-full flex-1" />
    </div>
  )
}

export const VaultTitleWhite: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  return (
    <div className="flex w-full items-center justify-between gap-x-3">
      <MintingPairsTitleLeftIcon className="w-full flex-1" />
      <span className="font-smb text-2xl">{children}</span>
      <MintingPairsTitleRightIcon className="w-full flex-1" />
    </div>
  )
}
