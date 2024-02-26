import { Image } from '@/components/Image'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { CloseIcon } from '@/assets/icons'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useSwitchChain } from 'wagmi'

const WrongNetworkModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { chains, switchChain } = useSwitchChain()

  const handleSwitch = () => {
    switchChain(
      { chainId: chains[0].id },
      {
        onSuccess: (data) => {
          console.info(`Switching successfully to ${data.name}`), onClose()
        },
        onError: () => console.error('Switching failed')
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border-2 border-black bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        <CloseIcon
          onClick={onClose}
          className="absolute right-2.5 top-2.5 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-y-9 p-6 pt-[42px]">
          <div className="whitespace-nowrap">network switch</div>
          <div className="flex w-[361px] flex-col items-center gap-y-6">
            <div className="w-[325px] font-psm text-sm">
              To stake your NFT, make sure the network of your wallet is set to:
            </div>
            <div className="flex flex-col items-center">
              {chains.map((v) => (
                <Image
                  key={v.id}
                  src={getIllustrationUrl('merlin-chain')}
                  className="mix-blend-lighten"
                />
              ))}
            </div>
          </div>
          <Button
            size="xs"
            className="w-[80px] font-psm text-sm"
            onClick={handleSwitch}>
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default WrongNetworkModal
