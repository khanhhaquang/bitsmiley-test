import { OnChainLoader } from '@/components/OnchainLoader'

import { DearBitSmiler } from '../Common'

export const OnChainLoading: React.FC = () => {
  return (
    <div className="flex flex-col gap-y-14 pt-8">
      <DearBitSmiler />
      <OnChainLoader />
    </div>
  )
}
