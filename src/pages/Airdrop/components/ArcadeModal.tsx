import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import AirdropCheckModal from './AirdropCheckModal'

const ArcadeModal: React.FC<{
  isOpen: boolean
  onCheck: () => void
  onClose: () => void
}> = ({ isOpen, onCheck, onClose }) => {
  return (
    <AirdropCheckModal
      isOpen={isOpen}
      onCheck={onCheck}
      onClose={onClose}
      amount={4853902}>
      <div className="flex h-[410px] w-[800px] flex-col items-center">
        <Image
          src={getIllustrationUrl('arcade-with-result-effect', 'gif')}
          className="h-[400px] w-[800px]"
        />
        <div className="flex gap-1">
          <div className="h-[7px] w-[24px] bg-[#FA0]/30"></div>
          <div className="h-[7px] w-[24px] bg-[#FA0]"></div>
        </div>
      </div>
    </AirdropCheckModal>
  )
}

export default ArcadeModal
