import { BitJade, CloseIcon, RightAngle } from '@/assets/icons'
import { Image } from '@/components/Image'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useMemo, useState } from 'react'
import { useChainId } from 'wagmi'
import { useWriteErc721SafeTransferFrom } from '@/contracts/ERC721'
import {
  stakingContractAddress,
  useReadStakingContractMaxParticipants,
  useReadStakingContractTotalParticipants
} from '@/contracts/Staking'
import { useUserInfo } from '@/hooks/useUserInfo'

export const ConnectedNotStaked: React.FC = () => {
  const [isNoNftModalOpen, setIsNoNftModalOpen] = useState(false)
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false)
  const maxParticipants = useReadStakingContractMaxParticipants()
  const totalParticipants = useReadStakingContractTotalParticipants()

  const remainSlot = useMemo(() => {
    return (maxParticipants.data || 0) - (totalParticipants.data || 0)
  }, [maxParticipants, totalParticipants])

  return (
    <>
      <ChooseNftModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
      />
      <NoNftModal
        isOpen={isNoNftModalOpen}
        onClose={() => setIsNoNftModalOpen(false)}
      />
      <div className="flex items-center justify-center gap-x-[83px] pt-16">
        <div className="flex h-full w-[288px] flex-col items-center gap-y-4 text-sm">
          <div className="text-nowrap font-smb text-cyan">
            Limited edition staking
          </div>
          <div>
            Stake until TGE, receive special rewards (limited seats available)
          </div>
          <div className="mt-3 flex items-center justify-center gap-x-2">
            <span className="text-[28px] font-semibold text-warning">
              {remainSlot}/{maxParticipants.data || '-'}
            </span>
            <span className="text-[15px]">left</span>
          </div>
        </div>

        <div className="relative flex h-[177px] w-[265px] flex-col items-center justify-between border-[3px] border-cyan bg-cyan/20 py-[25px] text-sm">
          <div className="font-smb text-[21px] text-cyan">REWARDS</div>
          <div className="flex items-center justify-center gap-x-2 font-smb text-xs text-cyan">
            <span>BITJADE</span>
            <BitJade />
            <span>X???</span>
          </div>
          <Button
            size="xs"
            className="w-[120px] bg-green2 shadow-stake-now-button"
            onClick={() => setIsChooseModalOpen(true)}>
            Stake now
          </Button>

          <RightAngle className="absolute left-0 top-0 text-green2" />
          <RightAngle className="absolute right-0 top-0 rotate-90 text-green2" />
          <RightAngle className="absolute bottom-0 right-0 rotate-180 text-green2" />
          <RightAngle className="absolute bottom-0 left-0 -rotate-90 text-green2" />
        </div>
      </div>
    </>
  )
}

const NoNftModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border-2 border-black bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        <CloseIcon
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer"
        />
        <div className="flex flex-col items-center p-11">
          <div className="mb-8 whitespace-nowrap">No NFT found</div>
          <p className="my-8 font-psm text-sm">
            You don’t have any recognized NFT in this wallet address. Wanna
            purchase one? Check out the market. [here]
          </p>
          <Button
            size="xs"
            className="w-[120px] font-psm text-sm"
            onClick={onClose}>
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  )
}

const ChooseNftModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const chainId = useChainId()
  const { address } = useUserInfo()
  const [selected, setSelected] = useState(0)
  const erc721TransferFrom = useWriteErc721SafeTransferFrom()

  const handleProceed = () => {
    //TODO: Fetching NFTs list, and select one them
    // Now is hardcode for testing
    const stakingAddress = stakingContractAddress[chainId]

    erc721TransferFrom.writeContractAsync({
      account: address,
      args: [address, stakingAddress, BigInt(0), '0x']
    })
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
          <div className="grid max-h-[345px] grid-cols-3 gap-5 overflow-y-scroll border border-dashed border-white/50 p-6">
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
          </div>
          <div className="my-8 font-psm text-sm">
            Each wallet can select one NFT to stake.
          </div>
          <Button
            size="xs"
            className="w-[120px] font-psm text-sm"
            onClick={() => handleProceed()}>
            Proceed
          </Button>
        </div>
      </div>
    </Modal>
  )
}
