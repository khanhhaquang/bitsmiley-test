import { ReactNode } from 'react'

import { ChevronRightIcon } from '@/assets/icons'
import { InfoIndicator } from '@/components/InfoIndicator'
import { IDetailedCollateral, IVault } from '@/types/vault'
import { cn } from '@/utils/cn'

import { VaultOpenInfoTable, VaultChangesInfoTable } from '../tables'

type VaultInfoProps = {
  type?: 'open' | 'manage'
  vault?: IVault
  changedVault?: IVault
  hasChangedVault?: boolean

  mintingPairs?: IDetailedCollateral
  borderSvg: ReactNode
  className?: string
  innerClassName?: string
}

export const VaultInfo: React.FC<VaultInfoProps> = ({
  type = 'open',
  mintingPairs,
  vault,
  changedVault,
  hasChangedVault,
  borderSvg,
  className,
  innerClassName
}) => {
  const isOpenVault = type === 'open'
  const table = isOpenVault ? VaultOpenInfoTable : VaultChangesInfoTable

  return (
    <div
      className={cn(
        'relative min-h-fit w-full flex items-center justify-center h-fit',
        className
      )}>
      <div
        className={cn(
          'relative z-20 w-full flex justify-start px-5 py-4 items-center gap-x-8 text-nowrap font-ibmr text-xs text-white',
          innerClassName
        )}>
        <div className="flex flex-col gap-y-3">
          {table.map(({ key, title, message }) => (
            <div className="flex items-center gap-x-2" key={key}>
              {title} <InfoIndicator message={message} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-y-3">
          {table.map(({ key, format, className }) => (
            <div
              key={key}
              className={cn('flex items-center gap-x-2', className)}>
              <span>{format(vault, mintingPairs)}</span>
              {hasChangedVault && (
                <>
                  <ChevronRightIcon width={5} className="text-white" />
                  <span>{format(changedVault, mintingPairs)}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 font-ibmr text-sm uppercase text-white [text-shadow:1.5px_0_0_rgba(0,0,0,0.25)]">
        {!isOpenVault ? 'Vault Changes' : 'Vault Info'}
      </div>

      {borderSvg}
    </div>
  )
}
