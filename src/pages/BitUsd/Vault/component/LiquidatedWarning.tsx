import { CloseIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IDetailedCollateral } from '@/types/vault'

export const LiquidatedWarning: React.FC<{
  open: boolean
  onClose: () => void
  mintingPair?: IDetailedCollateral
}> = ({ mintingPair, open, onClose }) => {
  const { blockExplorerUrl } = useUserInfo()

  const liquidated = mintingPair?.liquidated?.[0]

  if (!liquidated || !open) return null

  return (
    <div className="mb-6 flex items-center justify-between border border-yellow bg-white/5 px-3 py-1.5 font-ibmr text-sm text-yellow">
      <span>
        This vault was liquidated at block height: {liquidated?.blockNumber}{' '}
        <span className="group cursor-pointer font-ibmb text-green">
          [
          <a
            target="_blank"
            href={`${blockExplorerUrl}/tx/${liquidated?.transactionHash}`}
            className="group-hover:underline">
            Check on-chain
          </a>
          ]
        </span>
      </span>
      <button
        className="cursor-pointer text-white hover:text-white/50"
        onClick={onClose}>
        <CloseIcon width={10} height={10} />
      </button>
    </div>
  )
}
