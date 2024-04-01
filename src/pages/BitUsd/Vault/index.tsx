import { useParams } from 'react-router-dom'

import { OnChainLoader } from '@/components/OnchainLoader'
import { useCollaterals } from '@/hooks/useCollaterals'

import { ManageVault } from './ManageVault'
import { OpenVault } from './OpenVault'

const Vault: React.FC = () => {
  const { chainId, collateralId } = useParams()
  const { isMyVault, isLoading } = useCollaterals(Number(chainId), collateralId)

  if (!chainId || !collateralId) return null

  if (isLoading) return <OnChainLoader />

  return (
    <div className="relative size-full overflow-hidden pt-9">
      {isMyVault ? (
        <ManageVault chainId={Number(chainId)} collateralId={collateralId} />
      ) : (
        <OpenVault chainId={Number(chainId)} collateralId={collateralId} />
      )}
    </div>
  )
}

export default Vault
