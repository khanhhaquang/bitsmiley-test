import { useParams } from 'react-router-dom'

import { OnChainLoader } from '@/components/OnchainLoader'
import { useUserMintingPairs } from '@/hooks/useUserMintingPairs'

import { ManageVault } from './ManageVault'
import { OpenVault } from './OpenVault'

const Vault: React.FC = () => {
  const { chainId } = useParams()
  const { isMyVault, isLoading } = useUserMintingPairs(chainId)

  if (!chainId) return null

  if (isLoading) return <OnChainLoader />

  return (
    <div className="relative size-full pt-9">
      {isMyVault ? (
        <ManageVault chainId={chainId} />
      ) : (
        <OpenVault chainId={chainId} />
      )}
    </div>
  )
}

export default Vault
