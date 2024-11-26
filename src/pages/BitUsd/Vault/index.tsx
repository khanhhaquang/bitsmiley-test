import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'

import { OnChainLoader } from '@/components/OnchainLoader'
import { useCollaterals } from '@/hooks/useCollaterals'
import { isSuiChain, isZetaChain } from '@/utils/chain'

import { ManageVault } from './ManageVault'
import { MemoizedOpenVault as OpenVault } from './OpenVault'
import { SuiOpenVault } from './SuiOpenVault'
import { ZetaManageVault } from './ZetaManageVault'
import { ZetaOpenVault } from './ZetaOpenVault'

const Vault: React.FC = () => {
  const currentChainId = useChainId()
  const { chainId, collateralId } = useParams()
  const { isMyVault, isLoading, collateral } = useCollaterals(
    Number(chainId),
    collateralId
  )

  const vaultSection = useMemo(() => {
    if (collateralId) {
      if (isSuiChain(Number(chainId))) {
        return (
          <SuiOpenVault chainId={Number(chainId)} collateralId={collateralId} />
        )
      }
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

  if (!chainId || !collateralId || !currentChainId) return null

  if (isLoading) return <OnChainLoader />

  console.log('collateral', { collateral, currentChainId, chainId })
  // if (!collateral || currentChainId !== Number(chainId))
  //   return <Navigate to="/app/alphanet" replace />

  return (
    <div className="relative size-full overflow-hidden pt-9">
      {vaultSection}
    </div>
  )
}

export default Vault
