import ActionButton from '@/components/ActionButton'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

const AirdropCheckModal: React.FC<{
  isOpen: boolean
  onCheck: () => void
  onClose: () => void
  amount: number
  children?: React.ReactNode
}> = ({ isOpen, onCheck, onClose, amount, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop={false}>
      <div className="relative flex w-[465px] flex-col items-center gap-4 border border-[#E0A828] px-6 pb-8 pt-10">
        <div className="absolute -top-10 flex w-[380px] flex-col items-center justify-center border border-[#E0A828] bg-black">
          <div className="h-[30px] w-full bg-[#E0A828] text-center font-smb uppercase leading-[30px] text-black">
            your total airdrop
          </div>
          <div className="flex h-[54px] items-center gap-1 font-ibmb text-[32px] text-[#FFAA00]">
            <Image
              src={getIllustrationUrl('smile-icon', 'webp')}
              className="h-[30px] w-[34px]"
            />
            <div>{amount}</div>
          </div>
        </div>
        {children}
        <div className="flex gap-x-2">
          <ActionButton className="h-[30px] w-[110px]" onClick={onClose}>
            No Thanks
          </ActionButton>
          <ActionButton
            className="h-[30px] w-[110px] border-[#FFAA00]/80 bg-[#FFAA00]/80 text-black/75 hover:bg-[#FFAA00] hover:text-black/50 active:bg-[#FFAA00]/60 active:text-black"
            onClick={onCheck}>
            Check
          </ActionButton>
        </div>
      </div>
    </Modal>
  )
}

export default AirdropCheckModal
