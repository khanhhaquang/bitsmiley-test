import { formatEther } from 'viem'
import { useSwitchChain } from 'wagmi'

import { Image } from '@/components/Image'
import { useToast } from '@/components/ui/use-toast'
import { useAirdrop } from '@/hooks/useAirdrop'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IPointAirdrop } from '@/services/point'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberAsCompact } from '@/utils/number'

const AirdropCard: React.FC<{
  airdrop: IPointAirdrop
}> = ({ airdrop }) => {
  const { toast } = useToast()
  const { evmChainId, isConnected } = useUserInfo()
  const { switchChain } = useSwitchChain()

  const {
    chainID,
    airdropContract,
    address,
    season,
    presentDate,
    totalPoint,
    airDropToken
  } = airdrop
  const { canClaim, claim, isLoading, isClaiming, isClaimed } = useAirdrop({
    chainId: chainID,
    airdropContractAddress: airdropContract,
    address
  })
  const title = season > 0 ? `Season ${season}` : 'Pre season'
  const isActive = !!airdropContract && !isLoading

  const handleClaim = () => {
    if (canClaim) {
      toast({
        variant: 'destructive',
        title: `Airdrop ${title}`,
        description: 'Can not claim.',
        duration: 2000
      })
      return
    }

    if (isClaimed) {
      toast({
        title: `Airdrop ${title}`,
        description: 'This airdrop is already claimed.',
        duration: 2000
      })
      return
    }

    claim()
  }

  const handleClickClaim = () => {
    if (evmChainId && isConnected && chainID !== evmChainId) {
      switchChain(
        { chainId: chainID },
        {
          onSuccess: (newChain) => {
            console.log('Switched to: ', newChain.id)
            handleClaim()
          },
          onError: () => {
            console.error('Switching network failed')
          }
        }
      )
      return
    }

    handleClaim()
  }

  return (
    <div
      className={cn(
        'relative w-[324px] h-[406px] p-1 flex',
        isActive && 'blue-border-dashed-animation',
        !isActive && 'border border-dashed border-blue/60 opacity-50'
      )}>
      <div className="relative flex size-full shrink-0 flex-col items-center gap-y-9 overflow-hidden border border-blue/60 bg-black px-9 py-6">
        <Image
          width={162}
          height={203}
          className="absolute bottom-0 left-0"
          src={getIllustrationUrl('airdrop-card-bg')}
        />
        <div className="relative flex w-full flex-col">
          <h2 className="flex items-center justify-center font-smb text-2xl text-white [text-shadow:-2px_0_0_#2648EF]">
            {title}
          </h2>
          <div className="flex items-center justify-center gap-x-1 font-ibmr text-sm text-white/70">
            <div className="h-[1px] flex-1 bg-white/70" />
            <span>{presentDate} - present</span>
            <div className="h-[1px] flex-1 bg-white/70" />
          </div>
        </div>
        <div className="relative flex w-full flex-col gap-y-3">
          <p className="relative flex h-8 w-full items-center justify-center bg-blue font-ibmb text-black [text-shadow:1.5px_0_0px_rgba(0,0,0,0.25)]">
            bitPoint earned
            <Image
              className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2"
              src={getIllustrationUrl('airdrop-claim-session-bg')}
            />
          </p>
          <span className="flex items-center justify-center font-ibmr text-2xl text-white">
            {formatNumberAsCompact(totalPoint)}
          </span>
        </div>
        <div className="relative flex w-full flex-col gap-y-3">
          <p className="relative flex h-8 w-full items-center justify-center bg-yellow2 font-ibmb text-black [text-shadow:1.5px_0_0px_rgba(0,0,0,0.25)]">
            $BIT airdrop
            <Image
              className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2"
              src={getIllustrationUrl('airdrop-claim-session-bg')}
            />
          </p>
          <span className="flex items-center justify-center font-ibmb text-2xl text-yellow2">
            {airDropToken
              ? formatNumberAsCompact(formatEther(BigInt(airDropToken)))
              : 'Coming soon'}
          </span>
        </div>
        <ClaimButton
          className="relative"
          disabled={isClaiming || !isActive}
          onClick={handleClickClaim}>
          {isClaiming ? 'Claiming...' : 'Claim'}
        </ClaimButton>
      </div>
    </div>
  )
}

const ClaimButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  disabled,
  ...rest
}) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        'cursor-pointer w-full h-9 backdrop-blur-[20px]',
        'text-nowrap border border-white/50 bg-white/10 px-4 font-ibmb text-sm font-bold text-white/70 shadow-[0_0_5px_1px_rgba(255,255,255,0.12)]',
        'hover:bg-white/20 hover:text-white active:bg-white/5 active:text-white/50',
        'disabled:bg-white/10 disabled:text-white/20 disabled:cursor-not-allowed',
        className
      )}
      {...rest}></button>
  )
}

export default AirdropCard
