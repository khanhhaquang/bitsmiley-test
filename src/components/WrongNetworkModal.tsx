import { useSwitchChain } from 'wagmi'

import { Button } from '@/components/Button'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { chainsIconUrl } from '@/config/chain'
import { useDisconnectAccount } from '@/hooks/useDisconnectAccount'

const WrongNetworkModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { chains, switchChain } = useSwitchChain()
  const disconnect = useDisconnectAccount()

  const handleSwitch = (chainId: number) => {
    switchChain(
      { chainId: chainId },
      {
        onSuccess: (data) => {
          console.info(`Switching successfully to ${data.name}`), onClose()
        },
        onError: () => {
          disconnect()
          onClose()
          console.error('Switching network failed')
        }
      }
    )
  }

  const handleClose = () => {
    handleSwitch(chains[0].id)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative border-2 border-black bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        <div className="flex flex-col items-center gap-y-9 p-6 pt-[42px]">
          <div className="whitespace-nowrap">network switch</div>
          <div className="flex w-[361px] flex-col items-center gap-y-6">
            <div className="w-[325px] font-psm text-sm">
              To stake your NFT, make sure the network of your wallet is set to:
            </div>
            <div className="flex flex-col items-center gap-y-2">
              {chains.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleSwitch(v.id)}
                  className="flex cursor-pointer items-center gap-x-2 rounded-md px-3 py-2 text-base hover:bg-grey7">
                  <Image
                    className="shrink-0"
                    key={v.id}
                    src={chainsIconUrl[v.id]}
                    width={36}
                    height={36}
                  />
                  {v.name}
                </button>
              ))}
            </div>
          </div>
          <Button
            size="xs"
            className="w-[80px] font-psm text-sm"
            onClick={() => handleSwitch(chains[0].id)}>
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default WrongNetworkModal
