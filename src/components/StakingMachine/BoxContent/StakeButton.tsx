import { Button } from '@/components/Button'
import { useUserNfts } from '@/hooks/useUserNfts'
import { useState } from 'react'
import { Modal } from '@/components/Modal'
import { CloseIcon } from '@/assets/icons'

const NoNftModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-[400px] border-2 border-black bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
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

type StakeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const StakeButton: React.FC<StakeButtonProps> = ({
  onClick,
  children
}) => {
  const [isNoNftModalOpen, setIsNoNftModalOpen] = useState(false)
  const { nfts, isLoading: isFetchingNfts } = useUserNfts()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!nfts || nfts.length === 0) {
      setIsNoNftModalOpen(true)
      return
    }

    onClick?.(e)
  }

  return (
    <>
      <NoNftModal
        isOpen={isNoNftModalOpen}
        onClose={() => setIsNoNftModalOpen(false)}
      />
      <Button
        disabled={isFetchingNfts}
        size="xs"
        className="w-[120px] bg-green2 shadow-stake-now-button"
        onClick={(e) => handleClick(e)}>
        {children || 'Stake now'}
      </Button>
    </>
  )
}
