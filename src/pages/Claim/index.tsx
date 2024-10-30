import { useMemo } from 'react'

import { DollarShadowIcon } from '@/assets/icons'
import { OnChainLoader } from '@/components/OnchainLoader'
import { usePointAirdrop } from '@/hooks/usePointAirdrop'
import { cn } from '@/utils/cn'

import AirdropCard from './components/AirdropCard'

import { VaultTitleBlue } from '../BitUsd/components/VaultTitle'

const Claim: React.FC = () => {
  const { isLoading, data: pointAirdrops } = usePointAirdrop()

  const airdrops = useMemo(
    () => (pointAirdrops ? pointAirdrops : []),
    [pointAirdrops]
  )

  return (
    <div
      className={cn(
        'scrollbar-none flex size-full flex-col items-center gap-y-12 overflow-y-auto overscroll-contain py-11',
        'pt-7'
      )}>
      <VaultTitleBlue className="items-baseline gap-x-2">
        <DollarShadowIcon width={24} />
        SMILE Claim
      </VaultTitleBlue>

      {isLoading ? (
        <OnChainLoader />
      ) : (
        <div className="flex gap-x-12">
          {airdrops.length > 0
            ? airdrops.map((airdrop) => (
                <AirdropCard key={airdrop.id} airdrop={airdrop} />
              ))
            : 'No airdrops now'}
        </div>
      )}
    </div>
  )
}

export default Claim
