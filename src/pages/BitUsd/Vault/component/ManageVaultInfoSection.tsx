import {
  ManageVaultInfoTitleIcon,
  ManageVaultSectionTitleIcon,
  VaultInfoIcon
} from '@/assets/icons'
import { IVault } from '@/types/vault'
import { cn } from '@/utils/cn'

import { RefreshButton } from '../../components/RefreshButton'
import { ManageVaultVaultInfoTable } from '../../tables'

export const ManageVaultInfoSection: React.FC<{
  vault?: IVault
  className?: string
}> = ({ className, vault }) => {
  return (
    <div className={cn('flex flex-col gap-y-6', className)}>
      <ManageVaultSectionTitle
        type="info"
        title="Vault"
        subTitle="info"
        icon={<VaultInfoIcon width={27} height={29} />}
      />

      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
        {ManageVaultVaultInfoTable.map(({ key, title, format }, index) => (
          <div
            key={key}
            className={cn(
              'flex items-center border-t border-white/20 p-[1px] font-ibmr text-sm text-white/70',
              (index === ManageVaultVaultInfoTable.length - 1 ||
                index === ManageVaultVaultInfoTable.length - 2) &&
                'border-b'
            )}>
            <div className="h-6 w-[200px] border-r border-white/20 bg-white/5 px-1">
              {title}
            </div>
            <div className="py-1 pl-2 pr-1 font-bold text-white">
              {format(vault)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const ManageVaultSectionTitle: React.FC<{
  type?: 'info' | 'manage'
  icon: React.ReactNode
  title: string
  subTitle: string
  className?: string
}> = ({ type = 'manage', icon, title, subTitle, className }) => {
  return (
    <div className={cn('flex items-center gap-x-2 text-white', className)}>
      <div className="flex shrink-0 items-center gap-x-2 font-smb text-xs">
        {icon}
        <div>
          <div>{title}</div>
          <div>{subTitle}</div>
        </div>
      </div>
      <div className="relative w-full">
        {type === 'info' ? (
          <>
            <ManageVaultInfoTitleIcon className="w-full flex-1" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5">
              <RefreshButton />
            </div>
          </>
        ) : (
          <ManageVaultSectionTitleIcon className="w-full flex-1" />
        )}
      </div>
    </div>
  )
}
