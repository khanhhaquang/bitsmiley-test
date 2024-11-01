import { useMemo } from 'react'

import { useToast } from '@/components/ui/use-toast'

import { useAirdrop } from './useAirdrop'
import { useProjectInfo } from './useProjectInfo'
import { useUserInfo } from './useUserInfo'

export enum AirdropClaimType {
  TGE,
  Award,
  UnStake
}

export const useAirdropClaim = (type: AirdropClaimType, disabled?: boolean) => {
  const { toast } = useToast()
  const { evmChainId } = useUserInfo()
  const { projectInfo } = useProjectInfo()

  const airdropContracts = useMemo(() => {
    return projectInfo?.web3Info?.find((item) => item.chainId === evmChainId)
      ?.contract
  }, [evmChainId, projectInfo?.web3Info])

  const airdrop = useMemo(() => {
    if (!airdropContracts) return undefined

    if (
      !airdropContracts.TGEAirdropContract ||
      !airdropContracts.PreStakeRewardAirdropContract ||
      !airdropContracts.PreStakeUnStakeAirdropContract
    )
      return undefined

    if (type === AirdropClaimType.TGE)
      return airdropContracts.TGEAirdropContract
        ? {
            airdropContractAddress: airdropContracts.TGEAirdropContract,
            chainId: evmChainId
          }
        : undefined
    if (type === AirdropClaimType.Award)
      return airdropContracts.PreStakeRewardAirdropContract
        ? {
            airdropContractAddress:
              airdropContracts.PreStakeRewardAirdropContract,
            chainId: evmChainId
          }
        : undefined
    if (type === AirdropClaimType.UnStake)
      return airdropContracts.PreStakeUnStakeAirdropContract
        ? {
            airdropContractAddress:
              airdropContracts.PreStakeUnStakeAirdropContract,
            chainId: evmChainId
          }
        : undefined

    return undefined
  }, [airdropContracts, evmChainId, type])

  const { canClaim, claim, isLoading, isClaiming, isClaimed } = useAirdrop(
    airdrop,
    disabled
  )

  const isActive = useMemo(
    () => !isLoading && !!airdrop && !isClaiming,
    [airdrop, isClaiming, isLoading]
  )

  const handleClaim = (
    title: string = '',
    callback?: (error?: unknown) => void
  ) => {
    if (!airdropContracts) {
      toast({
        variant: 'destructive',
        title: title || 'Claim Airdrop',
        description: 'Unavailable contract',
        duration: 2000
      })
      return
    }

    if (!canClaim) {
      toast({
        variant: 'destructive',
        title: title || 'Claim Airdrop',
        description: 'Can not claim.',
        duration: 2000
      })
      return
    }

    if (isClaimed) {
      toast({
        title: title || 'Claim Airdrop',
        description: 'This amount is already claimed.',
        duration: 2000
      })
      return
    }

    claim(callback)
  }

  return {
    isActive,
    handleClaim
  }
}
