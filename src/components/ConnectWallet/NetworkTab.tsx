import { Image } from '@/components/Image'
import { chainsIconUrl, chainsTitle } from '@/config/chain'
import { cn } from '@/utils/cn'

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
  chainIds: number[]
  selectedNetwork: number
  onNetworkChange: (network: number) => void
}> = ({ chainIds, selectedNetwork, onNetworkChange }) => {
  return (
    <div className="flex gap-4">
      {chainIds.map((c) => (
        <NetworkButton
          key={c}
          text={chainsTitle[c]}
          icon={chainsIconUrl[c]}
          selected={selectedNetwork === c}
          onClick={() => onNetworkChange(c)}
        />
      ))}
    </div>
  )
}
