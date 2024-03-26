import { InfoIndicator } from '@/components/InfoIndicator'
import { IMintingPair } from '@/services/user'
import { cn } from '@/utils/cn'
import { formatNumberAsCompact } from '@/utils/number'

import { messages } from '../../tables'

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
      <span>Network: {mintingPair?.network || '--'}</span>
      <span>
        Stability Fee <InfoIndicator message={messages.stabilityFee} />: 0%
      </span>
      <span>
        Liquidation Fee <InfoIndicator message={messages.liquidationFee} />:{' '}
        {mintingPair?.liquidationPenalty || '--'}%
      </span>
      <span>
        Vault floor <InfoIndicator message={messages.vaultFloor} />: $
        {formatNumberAsCompact(mintingPair?.vaultFloor || '')}
      </span>
    </div>
  )
}

export default VaultHeader
