import { ReactNode } from 'react'

import { ChevronRightIcon } from '@/assets/icons'
import { InfoIndicator } from '@/components/InfoIndicator'
import { IMintingPair } from '@/services/user'
import { IVault } from '@/types/vault'
import { cn } from '@/utils/cn'

import { RefreshButton } from './RefreshButton'

import { VaultInfoTable, VaultChangesInfoTable } from '../tables'

type VaultInfoProps = {
  type?: 'info' | 'changes'
  vault?: IVault
  changedVault?: IVault
  hasChangedVault?: boolean

  mintingPairs?: IMintingPair
  borderSvg: ReactNode
  className?: string
  innerClassName?: string
}

export const VaultInfo: React.FC<VaultInfoProps> = ({
  type = 'info',
  mintingPairs,
  vault,
  changedVault,
  hasChangedVault,
  borderSvg,
  className,
  innerClassName
}) => {
  const isVaultChanges = type === 'changes'
  const table = isVaultChanges ? VaultChangesInfoTable : VaultInfoTable

  const isVaultHealthy =
    isVaultChanges && !!vault && Number(vault?.healthFactor) > 100
  const isVaultUnHealthy =
    isVaultChanges && !!vault && Number(vault?.healthFactor) < 100
  const isChangedVaultHealthy =
    isVaultChanges &&
    hasChangedVault &&
    Number(changedVault?.healthFactor) > 100
  const isChangedVaultUnHealthy =
    isVaultChanges &&
    hasChangedVault &&
    Number(changedVault?.healthFactor) < 100

  return (
    <div
      className={cn(
        'relative aspect-[400/157] w-full flex items-center justify-center',
        className
      )}>
      <div
        className={cn(
          'relative z-10 flex items-center gap-x-8 text-nowrap px-7 py-4 font-ibmr text-sm text-white/70',
          innerClassName
        )}>
        <div className="flex flex-col gap-y-1.5">
          {table.map(({ key, title, message }) => (
            <div className="flex items-center gap-x-2" key={key}>
              {title} <InfoIndicator message={message} />
            </div>
          ))}
        </div>
        <div
          className={cn(
            'flex flex-col gap-y-1.5 text-white',
            isVaultHealthy && 'text-green',
            isVaultUnHealthy && 'text-yellow',
            isChangedVaultHealthy && 'text-green',
            isChangedVaultUnHealthy && 'text-yellow'
          )}>
          {table.map(({ key, format }) => (
            <div key={key} className="flex items-center gap-x-2">
              <span>
                {format(
                  (isVaultChanges ? vault : mintingPairs) as IMintingPair &
                    IVault
                )}
              </span>
              {hasChangedVault && (
                <>
                  <ChevronRightIcon width={5} />
                  <span>{format(changedVault as IMintingPair & IVault)}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -top-1.5 left-1/2 z-10 -translate-x-1/2 font-smb text-xs text-blue [text-shadow:1.5px_0_0_rgba(0,0,0,0.25)]">
        {isVaultChanges ? (
          <span className="flex items-center gap-x-2">
            Vault Changes <RefreshButton />
          </span>
        ) : (
          'Vault Info'
        )}
      </div>

      {borderSvg}
    </div>
  )
}
