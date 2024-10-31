import { useMemo } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'

import { useToast } from '@/components/ui/use-toast'

import { useAirdrop } from './useAirdrop'
import { useProjectInfo } from './useProjectInfo'
import { useUserInfo } from './useUserInfo'

export enum AirdropClaimType {
  TGE,
  Award,
  UnStake
}

export const useAirdropClaim = (type: AirdropClaimType) => {
  const { toast } = useToast()
  const { evmChainId, isConnected } = useUserInfo()
  const { projectInfo } = useProjectInfo()
  const { switchChain } = useSwitchChain()
  const chainID = useChainId()
  const ETH_CHAIN = 17000

  const airdrop = useMemo(() => {
    const airdropInfo = projectInfo?.web3Info?.find(
      (item) => item.chainId === ETH_CHAIN
    )
    console.log(airdropInfo)
    if (!airdropInfo) return undefined

    if (
      !airdropInfo?.contract.TGEAirdropContract ||
      !airdropInfo?.contract.PreStakeRewardAirdropContract ||
      !airdropInfo?.contract.PreStakeUnStakeAirdropContract
    )
      return undefined
    if (type === AirdropClaimType.TGE)
      return airdropInfo?.contract.TGEAirdropContract
        ? {
            airdropContractAddress: airdropInfo?.contract.TGEAirdropContract,
            chainId: airdropInfo.chainId
          }
        : undefined
    if (type === AirdropClaimType.Award)
      return airdropInfo?.contract.PreStakeRewardAirdropContract
        ? {
            airdropContractAddress:
              airdropInfo?.contract.PreStakeRewardAirdropContract,
            chainId: airdropInfo.chainId
          }
        : undefined
    if (type === AirdropClaimType.UnStake)
      return airdropInfo?.contract.PreStakeUnStakeAirdropContract
        ? {
            airdropContractAddress:
              airdropInfo?.contract.PreStakeUnStakeAirdropContract,
            chainId: airdropInfo.chainId
          }
        : undefined

    return undefined
  }, [projectInfo, type])

  const { canClaim, claim, isLoading, isClaiming, isClaimed } =
    useAirdrop(airdrop)
  const isContractValid = useMemo(() => !!airdrop, [airdrop])

  const isActive = useMemo(() => {
    console.log(
      'isContractValid:',
      isContractValid,
      'isLoading:',
      isLoading,
      'isClaiming:',
      isClaiming
    )
    return !isLoading && !isContractValid && !isClaiming
  }, [isClaiming, isLoading, isContractValid])

  const handleProceed = () => {
    if (!canClaim) {
      toast({
        variant: 'destructive',
        title: `Claim Airdrop`,
        description: 'Can not claim.',
        duration: 2000
      })
      return
    }

    if (isClaimed) {
      toast({
        title: `Claim Airdrop`,
        description: 'This airdrop is already claimed.',
        duration: 2000
      })
      return
    }

    claim()
  }

  const handleClaim = () => {
    if (evmChainId && isConnected && chainID !== ETH_CHAIN) {
      switchChain(
        { chainId: ETH_CHAIN },
        {
          onSuccess: (newChain) => {
            console.log('Switched to: ', newChain.id)
            handleProceed()
          },
          onError: () => {
            console.error('Switching network failed')
          }
        }
      )
      return
    }

    handleProceed()
  }

  return {
    isActive,
    handleClaim
  }
}
