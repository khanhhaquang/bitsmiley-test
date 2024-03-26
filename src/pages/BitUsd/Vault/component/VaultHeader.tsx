import { InfoIndicator } from '@/components/InfoIndicator'
import { IMintingPair } from '@/services/user'
import { cn } from '@/utils/cn'

import { VaultHeaderColumns } from '../../tables'

const VaultHeader: React.FC<{
  mintingPair?: IMintingPair
  className?: string
}> = ({ mintingPair, className }) => {
  return (
    <div
      className={cn(
        'flex justify-evenly mt-5 font-ibmr text-xs text-white/70 gap-x-9',
        className
      )}>
      {VaultHeaderColumns.map(({ key, title, message, format }) => (
        <span key={key}>
          {title} <InfoIndicator message={message} />: {format(mintingPair)}
        </span>
      ))}
    </div>
  )
}

export default VaultHeader
