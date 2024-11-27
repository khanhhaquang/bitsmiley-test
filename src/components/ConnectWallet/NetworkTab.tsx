import { Chain } from 'viem/chains'

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
  chains: Chain[]
  selectedNetwork: number
  onNetworkChange: (network: number) => void
}> = ({ chains, selectedNetwork, onNetworkChange }) => {
  return (
    <div className="flex gap-4">
      {chains.map((c) => (
        <NetworkButton
          key={c.id}
          text={chainsTitle[c.id]}
          icon={chainsIconUrl[c.id]}
          selected={selectedNetwork === c.id}
          onClick={() => onNetworkChange(c.id)}
        />
      ))}
    </div>
  )
}
