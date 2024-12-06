import { CloseIcon } from '@/assets/icons'
import ActionButton from '@/components/ActionButton'
import { Modal } from '@/components/Modal'
import { useDisconnectAccount } from '@/hooks/useDisconnectAccount'

export const NetworkCheckModal: React.FC<{
  isOpen: boolean
  onLogout: () => void
  onClose: () => void
}> = ({ isOpen, onLogout, onClose }) => {
  const disconnect = useDisconnectAccount()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border bg-black bg-connect-modal bg-cover bg-no-repeat font-ibmr text-sm">
        <CloseIcon
          onClick={onClose}
          className="absolute right-2.5 top-2.5 z-[100] cursor-pointer"
        />
        <div className="flex w-[507px] flex-col items-center gap-6 p-6">
          <h2 className="text-center text-2xl text-white">
            Network Compatibility Check
          </h2>
          <div className="text-center">
            Your wallet isn’t compatible with this network. Please log out and
            connect with a supported wallet.
          </div>
          <ActionButton
            className="h-[30px] w-[110px] bg-white/70 uppercase text-black/75"
            onClick={() => {
              disconnect()
              onLogout()
            }}>
            log out
          </ActionButton>
        </div>
      </div>
    </Modal>
  )
}
