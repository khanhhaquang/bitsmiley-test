import { useState } from 'react'
import { erc721Abi } from 'viem'
import { useWriteContract } from 'wagmi'

import { CloseIcon } from '@/assets/icons'
import { Button } from '@/components/Button'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useStoreActions } from '@/hooks/useStoreActions'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserNfts } from '@/hooks/useUserNfts'
import { INft } from '@/services/user'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

type NftProps = {
  nft: INft
  isSelected?: boolean
  onClick: () => void
}

const Nft: React.FC<NftProps> = (props) => {
  const { nft, isSelected, onClick } = props
  const { tokenID } = nft

  // TODO: getting on chain image
  // const uri = useReadErc721TokenUri({ args: [BigInt(tokenID)] })

  return (
    <div
      key={tokenID}
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-y-1.5">
      <Image
        src={getIllustrationUrl('bit-mint', 'webp')}
        className={cn(
          'h-[203px] w-[207px]',
          isSelected && 'border-4 border-white'
        )}
      />
      <span className="font-psm text-sm">{tokenID}</span>
    </div>
  )
}

export const ChooseNftModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { addTransaction } = useStoreActions()
  const { address } = useUserInfo()
  const { evmContractAddresses } = useContractAddresses()
  const { nfts, removeLocalNft } = useUserNfts()
  const [selectedTokenId, setSelectedTokenId] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { writeContractAsync } = useWriteContract()

  const handleProceed = async () => {
    const stakingAddress = evmContractAddresses?.staking
    const erc721Address = evmContractAddresses?.l2nft

    if (erc721Address && selectedTokenId && stakingAddress && address) {
      try {
        setIsProcessing(true)
        const txId = await writeContractAsync({
          abi: erc721Abi,
          address: erc721Address,
          functionName: 'safeTransferFrom',
          args: [address, stakingAddress, BigInt(selectedTokenId), '0x']
        })
        setSelectedTokenId(null)
        addTransaction(txId)
        removeLocalNft(selectedTokenId)
        onClose()
      } catch (e) {
        console.error(e)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border border-white/50 bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        <CloseIcon
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer"
        />
        <div className="flex flex-col items-center p-11">
          <div className="mb-8 whitespace-nowrap">Choose one NFT to stake</div>
          <div className="grid max-h-[345px] max-w-[700px] grid-cols-3 gap-[19px] overflow-y-scroll border border-dashed border-white/50 bg-black/75 p-6">
            {nfts?.map((nft) => (
              <Nft
                key={nft.tokenID}
                nft={nft}
                isSelected={nft.tokenID === selectedTokenId}
                onClick={() => setSelectedTokenId(nft.tokenID)}
              />
            ))}
          </div>
          <p className="mb-8 mt-4 w-full text-left font-psm text-sm">
            Each wallet can select one NFT to stake.
          </p>
          <Button
            disabled={isProcessing || !selectedTokenId}
            size="xs"
            className="w-[120px] font-psm text-sm"
            onClick={() => handleProceed()}>
            {isProcessing ? 'Loading' : 'Proceed'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
