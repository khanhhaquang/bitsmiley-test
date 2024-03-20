import { Image } from '@/components/Image'
import { chainsIconUrl } from '@/config/chain'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'

export const NetworkIndicator: React.FC<{ className?: string }> = ({
  className
}) => {
  const { evmChain } = useUserInfo()
  const chainIconUrl = !evmChain?.id ? '' : chainsIconUrl[evmChain?.id]

  return (
    !!evmChain && (
      <div
        className={cn(
          'flex items-center justify-center gap-x-0.5 text-xs text-white/70',
          className
        )}>
        {chainIconUrl && <Image width={15} height={15} src={chainIconUrl} />}
        {evmChain.name}
        <span className="ml-2 size-2 rounded-full bg-green" />
      </div>
    )
  )
}
