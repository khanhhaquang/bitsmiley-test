import { useMemo, useState } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'

import { CloseIcon } from '@/assets/icons'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { stakeSupportedChainIds } from '@/config/chain'
import { useSupportedChains } from '@/hooks/useSupportedChains'
import { useUserNfts } from '@/hooks/useUserNfts'

const NoNftModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-[384px] border border-white/50 bg-black bg-connect-modal bg-cover bg-no-repeat px-9 pb-6  pt-12 font-smb">
        <CloseIcon
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-8">
          <h2 className="whitespace-nowrap text-2xl">No NFT found</h2>
          <p className="font-psm text-sm">
            You don’t have any recognized NFT in this wallet address.
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

  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { supportedChainIds } = useSupportedChains()

  const stakeChainId = useMemo(
    () =>
      supportedChainIds.filter((c) => stakeSupportedChainIds.includes(c))?.[0],
    [supportedChainIds]
  )

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!stakeChainId) return

    if (currentChainId !== stakeChainId) {
      switchChain(
        { chainId: stakeChainId },
        {
          onSuccess: (data) => {
            console.info(`Switching successfully to ${data.name}`)
            if (!nfts || nfts.length === 0) {
              setIsNoNftModalOpen(true)
              return
            }

            onClick?.(e)
          },
          onError: () => {
            console.error('Switching network failed')
          }
        }
      )
    } else {
      if (!nfts || nfts.length === 0) {
        setIsNoNftModalOpen(true)
        return
      }

      onClick?.(e)
    }
  }

  return (
    <>
      <NoNftModal
        isOpen={isNoNftModalOpen}
        onClose={() => setIsNoNftModalOpen(false)}
      />
      <Button
        disabled={isFetchingNfts || !stakeChainId}
        size="xs"
        className="w-[120px] shadow-stake-now-button hover:bg-green3 hover:shadow-stake-now-button active:bg-green2"
        onClick={(e) => handleClick(e)}>
        {children || 'Stake now'}
      </Button>
    </>
  )
}
