import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import './PreSeasonStakeModal.scss'
import AirdropCheckModal from './AirdropCheckModal'

import { cn } from '@/utils/cn'

const PreSeasonStakeModal: React.FC<{
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
      <div className="relative mt-8 h-[292px] w-[380px]">
        <Image
          src={getIllustrationUrl('stake-coins-bg-2', 'webp')}
          className="absolute -left-[75px] bottom-16"
        />
        <Image
          src={getIllustrationUrl('stake-coins-bg-2', 'webp')}
          className="absolute -right-[75px] bottom-16 -scale-x-[1]"
        />
        <div className="absolute left-0 top-0 flex flex-col items-center gap-3 text-center">
          <div className="flex w-[380px] flex-col items-center gap-6 bg-[#1A1607] p-3 pb-5 text-center">
            <Image
              src={getIllustrationUrl('pre-session-corner', 'webp')}
              className="absolute left-2 top-2"
            />
            <Image
              src={getIllustrationUrl('pre-session-corner', 'webp')}
              className="absolute right-2 top-2 rotate-90"
            />
            <div className="font-ibmr text-2xl uppercase text-[#FA0]">
              pre-session stake
            </div>
            <div className="relative flex h-[92px] w-full justify-center">
              <Image
                src={getIllustrationUrl('face-coin', 'gif')}
                className="h-[92px] w-[104px]"></Image>
              <div
                className={cn(
                  'apyText',
                  'absolute inset-x-0 bottom-0 m-auto w-[350px] font-smb2 text-[32px] leading-none'
                )}
                data-storke="10000% APY">
                10000% APY
              </div>
            </div>

            <div className="font-ibmr text-[#FA0]">
              Withdraw anytime! Harvest
              <br />
              your yield anytime！
            </div>
          </div>
          <div className="flex gap-1">
            <div className="h-[7px] w-[24px] bg-[#FA0]"></div>
            <div className="h-[7px] w-[24px] bg-[#FA0]/30"></div>
          </div>
        </div>
        <Image
          src={getIllustrationUrl('stake-coins-bg', 'webp')}
          className="absolute -left-[95px] bottom-0"
        />
        <Image
          src={getIllustrationUrl('stake-coins-bg', 'webp')}
          className="absolute -right-[65px] bottom-0"
        />
      </div>
    </AirdropCheckModal>
  )
}

export default PreSeasonStakeModal
