import { Image } from '@/components/Image'
import { useGetMyPreStake } from '@/queries/airdrop'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import AirdropCheckModal from './AirdropCheckModal'

const ArcadeModal: React.FC<{
  isOpen: boolean
  isReady?: boolean
  onCheck: () => void
  onClose: () => void
}> = ({ isOpen, isReady, onCheck, onClose }) => {
  const { data } = useGetMyPreStake()

  return (
    <AirdropCheckModal
      isEventReady={isReady}
      isOpen={isOpen}
      onCheck={onCheck}
      onClose={onClose}
      amount={data?.data.totalAirdrop ?? 0}>
      <div className="flex w-[800px] flex-col items-center">
        <Image
          src={getIllustrationUrl('arcade-with-result-effect', 'gif')}
          className="h-[400px] w-[800px]"
        />
        <div className="flex gap-1">
          <div className="h-[7px] w-[24px] bg-[#FA0]/30"></div>
          <div className="h-[7px] w-[24px] bg-[#FA0]"></div>
        </div>
        {!isReady && (
          <p className="mt-4 w-[377px] text-center font-ibmb text-base">
            Special Arcade is coming soon. Win $SMILE, TESLA! Stay tuned.
          </p>
        )}
      </div>
    </AirdropCheckModal>
  )
}

export default ArcadeModal
