import { ReactNode } from 'react'

import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import AirdropCheckModal from './AirdropCheckModal'
import styles from './PreSeasonStakeModal.module.scss'

export const PreSeasonStakeInfo: React.FC<{
  className?: string
  children?: ReactNode
}> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'relative flex w-[380px] flex-col items-center gap-6 bg-[#1A1607] p-3 pb-5 text-center',
        className
      )}>
      <Image
        width={16}
        height={15}
        src={getIllustrationUrl('pre-season-corner', 'webp')}
        className="absolute left-2 top-2"
      />
      <Image
        width={16}
        height={15}
        src={getIllustrationUrl('pre-season-corner', 'webp')}
        className="absolute right-2 top-2 rotate-90"
      />
      <h3 className="font-ibmb text-2xl uppercase text-[#FA0]">
        pre-season stake
      </h3>
      <div className="relative flex h-[92px] w-full justify-center">
        <Image
          src={getIllustrationUrl('face-coin', 'gif')}
          className="h-[92px] w-[104px]"
        />
        <div
          className={cn(
            styles.apyText,
            'absolute inset-x-0 bottom-0 m-auto w-[350px] font-smb2 text-[32px] leading-none'
          )}
          data-storke="10000% APY">
          10000% APY
        </div>
      </div>

      <div className="font-ibmr text-[#FA0]">
        Unstake anytime! Harvest
        <br />
        your yield anytime!
      </div>

      {children}
    </div>
  )
}

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
          className="absolute bottom-16 left-[-75px]"
        />
        <Image
          src={getIllustrationUrl('stake-coins-bg-2', 'webp')}
          className="absolute bottom-16 right-[-75px] scale-x-[-1]"
        />
        <Image
          src={getIllustrationUrl('stake-coins-bg', 'webp')}
          className="absolute bottom-0 left-[-95px] z-10"
        />
        <Image
          src={getIllustrationUrl('stake-coins-bg', 'webp')}
          className="absolute bottom-0 right-[-65px] z-10"
        />
        <div className="relative flex flex-col items-center gap-3 text-center">
          <PreSeasonStakeInfo />
          <div className="flex gap-1">
            <div className="h-[7px] w-[24px] bg-[#FA0]"></div>
            <div className="h-[7px] w-[24px] bg-[#FA0]/30"></div>
          </div>
        </div>
      </div>
    </AirdropCheckModal>
  )
}

export default PreSeasonStakeModal
