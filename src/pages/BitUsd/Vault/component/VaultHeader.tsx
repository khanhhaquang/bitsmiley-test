import { InfoIndicator } from '@/components/InfoIndicator'
import { IDetailedCollateral } from '@/types/vault'
import { cn } from '@/utils/cn'

import { VaultHeaderColumns } from '../../tables'

const VaultHeader: React.FC<{
  mintingPair?: IDetailedCollateral
  className?: string
}> = ({ mintingPair, className }) => {
  return (
    <div
      className={cn(
        'w-full flex justify-center mt-5 font-ibmr text-xs text-white/70 gap-x-9',
        className
      )}>
      {VaultHeaderColumns.map(({ key, title, message, format }) => (
        <span key={key} className="flex items-center gap-x-1">
          {title} <InfoIndicator message={message} />: {format(mintingPair)}
        </span>
      ))}
    </div>
  )
}

export default VaultHeader
