import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'

import { OnChainLoader } from '@/components/OnchainLoader'
import { useCollaterals } from '@/hooks/useCollaterals'
import { useSuiCollaterals } from '@/hooks/useSuiCollaterals'
import { isSuiChain, isZetaChain } from '@/utils/chain'

import { ManageVault } from './ManageVault'
import { MemoizedOpenVault as OpenVault } from './OpenVault'
import { SuiManageVault } from './SuiManageVault'
import { SuiOpenVault } from './SuiOpenVault'
import { ZetaManageVault } from './ZetaManageVault'
import { ZetaOpenVault } from './ZetaOpenVault'

const EvmVault: React.FC = () => {
  const currentChainId = useChainId()
  const { chainId, collateralId } = useParams()
  const { isMyVault, isLoading, collateral } = useCollaterals(
    Number(chainId),
    collateralId
  )

  const vaultSection = useMemo(() => {
    if (collateralId) {
      if (isZetaChain(Number(chainId))) {
        return isMyVault ? (
          <ZetaManageVault
            chainId={Number(chainId)}
            collateralId={collateralId}
          />
        ) : (
          <ZetaOpenVault
            chainId={Number(chainId)}
            collateralId={collateralId}
          />
        )
      }

      return isMyVault ? (
        <ManageVault chainId={Number(chainId)} collateralId={collateralId} />
      ) : (
        <OpenVault chainId={Number(chainId)} collateralId={collateralId} />
      )
    }

    return null
  }, [chainId, collateralId, isMyVault])

  if (!collateralId || !currentChainId) return null

  if (isLoading) return <OnChainLoader />

  if (!collateral || currentChainId !== Number(chainId))
    return <Navigate to="/app/alphanet" replace />

  return (
    <div className="relative size-full overflow-hidden pt-9">
      {vaultSection}
    </div>
  )
}

const SuiVault: React.FC = () => {
  const { chainId, collateralId } = useParams()
  const { isLoading, isMyVault } = useSuiCollaterals(collateralId)

  if (!collateralId) return null

  if (isLoading) return <OnChainLoader />

  return (
    <div className="relative size-full overflow-hidden pt-9">
      {isMyVault ? (
        <SuiManageVault chainId={Number(chainId)} collateralId={collateralId} />
      ) : (
        <SuiOpenVault chainId={Number(chainId)} collateralId={collateralId} />
      )}
    </div>
  )
}

const Vault: React.FC = () => {
  const { chainId } = useParams()

  if (!chainId) return null

  if (isSuiChain(Number(chainId))) return <SuiVault />

  return <EvmVault />
}

export default Vault
