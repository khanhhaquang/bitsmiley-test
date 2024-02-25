import {
  useReadStakingContractGetUserStakes,
  useReadStakingContractNftContractAddr
} from '@/contracts/Staking'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useWriteContract } from 'wagmi'
import { CloseIcon } from '@/assets/icons'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { useState } from 'react'
import { useChainId } from 'wagmi'
import { erc721Abi } from 'viem'
import { merlinAddresses } from '@/config/wagmi'

export const ChooseNftModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const chainId = useChainId()
  const { address } = useUserInfo()
  // const [selected, setSelected] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tokenId, setTokenId] = useState('')

  const { writeContractAsync } = useWriteContract()
  const { data: erc721Address } = useReadStakingContractNftContractAddr()
  const { refetch: refetchUserStakes } = useReadStakingContractGetUserStakes({
    args: [address]
  })

  const handleProceed = async () => {
    //TODO: Fetching NFTs list, and select one them
    // Now is hardcode for testing
    const stakingAddress = merlinAddresses[chainId]

    if (erc721Address) {
      try {
        setIsProcessing(true)
        const txId = await writeContractAsync({
          abi: erc721Abi,
          address: erc721Address,
          functionName: 'safeTransferFrom',
          args: [address, stakingAddress, BigInt(tokenId), '0x']
        })
        refetchUserStakes()
        console.log(txId)
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
      <div className="relative border-2 border-black bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        <CloseIcon
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer"
        />
        <div className="flex flex-col items-center p-11">
          <div className="mb-8 whitespace-nowrap">Choose one NFT to stake</div>
          <label className="flex items-center text-sm">
            Token ID:
            <input
              autoFocus
              type="number"
              className="ml-1 border border-white bg-transparent py-2 text-center focus:outline-none"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </label>
          {/* <div className="grid max-h-[345px] grid-cols-3 gap-5 overflow-y-scroll border border-dashed border-white/50 p-6">
              {Array(5)
                .fill(1)
                .map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setSelected(index)}
                    className="flex cursor-pointer flex-col items-center gap-y-1.5">
                    <Image
                      src={getIllustrationUrl('bit-mint', 'webp')}
                      className={cn(
                        'h-[203px] w-[207px]',
                        index === selected && 'border-4 border-white'
                      )}
                    />
                    <div className="font-psm text-sm">bitDisc-black #1923</div>
                  </div>
                ))}
            </div> */}
          <div className="my-8 font-psm text-sm">
            Each wallet can select one NFT to stake.
          </div>
          <Button
            disabled={isProcessing}
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
