import { Navigate, useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'

import { OnChainLoader } from '@/components/OnchainLoader'
import { useCollaterals } from '@/hooks/useCollaterals'
import { isZetaChain } from '@/utils/chain'

import { ManageVault } from './ManageVault'
import { MemoizedOpenVault as OpenVault } from './OpenVault'
import { ZetaOpenVault } from './ZetaOpenVault'

const Vault: React.FC = () => {
  const currentChainId = useChainId()
  const { chainId, collateralId } = useParams()
  const { isMyVault, isLoading, collateral } = useCollaterals(
    Number(chainId),
    collateralId
  )

  if (!chainId || !collateralId || !currentChainId) return null

  if (isLoading) return <OnChainLoader />

  if (!collateral || currentChainId !== Number(chainId))
    return <Navigate to="/app/alphanet" replace />

  return (
    <div className="relative size-full overflow-hidden pt-9">
      {isMyVault ? (
        <ManageVault chainId={Number(chainId)} collateralId={collateralId} />
      ) : isZetaChain(Number(chainId)) ? (
        <ZetaOpenVault chainId={Number(chainId)} collateralId={collateralId} />
      ) : (
        <OpenVault chainId={Number(chainId)} collateralId={collateralId} />
      )}
    </div>
  )
}

export default Vault
