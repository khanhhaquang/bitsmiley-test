import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export enum ConnectNetworkType {
  MERLIN = 'Merlin',
  BITLAYER = 'Bitlayer',
  SUI = 'Sui'
}

const NetworkButton: React.FC<{
  text: string
  icon: string
  selected: boolean
  onClick: () => void
}> = ({ text, icon, selected, onClick }) => {
  return (
    <div
      className={cn(
        'flex gap-2 items-center pb-[2px] hover:border-b border-white cursor-pointer',
        selected && 'border-b border-white'
      )}
      onClick={onClick}>
      <Image src={icon} className="aspect-square size-4" />
      <div className="font-ibmr text-base">{text}</div>
    </div>
  )
}

export const NetworkTab: React.FC<{
  selectedNetwork: ConnectNetworkType
  onNetworkChange: (network: ConnectNetworkType) => void
}> = ({ selectedNetwork, onNetworkChange }) => {
  return (
    <div className="flex gap-4">
      <NetworkButton
        text={ConnectNetworkType.MERLIN}
        icon={getIllustrationUrl('merlin-chain-logo', 'webp')}
        selected={selectedNetwork === ConnectNetworkType.MERLIN}
        onClick={() => onNetworkChange(ConnectNetworkType.MERLIN)}
      />
      <NetworkButton
        text={ConnectNetworkType.BITLAYER}
        icon={getIllustrationUrl('bitlayer-chain-logo', 'webp')}
        selected={selectedNetwork === ConnectNetworkType.BITLAYER}
        onClick={() => onNetworkChange(ConnectNetworkType.BITLAYER)}
      />
      <NetworkButton
        text={ConnectNetworkType.SUI}
        icon={getIllustrationUrl('sui-chain-logo', 'webp')}
        selected={selectedNetwork === ConnectNetworkType.SUI}
        onClick={() => onNetworkChange(ConnectNetworkType.SUI)}
      />
    </div>
  )
}
